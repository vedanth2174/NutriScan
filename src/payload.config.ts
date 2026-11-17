import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Assessments } from './collections/Assessments'
import { NutritionPlans } from './collections/NutritionPlans'
import { FoodScans } from './collections/FoodScans'
import { MealLogs } from './collections/MealLogs'
import { ProgressEntries } from './collections/ProgressEntries'
import { ChatMessages } from './collections/ChatMessages'
import { Subscriptions } from './collections/Subscriptions'

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is required. Copy .env.example to .env and generate a secret before starting NutriScan.')
}
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required. Start PostgreSQL and configure .env before starting NutriScan.')
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3Configured = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
)

const storage = s3Configured
  ? [
      s3Storage({
        bucket: process.env.S3_BUCKET!,
        collections: { media: true },
        config: {
          region: process.env.S3_REGION!,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
          },
          ...(process.env.S3_ENDPOINT
            ? {
                endpoint: process.env.S3_ENDPOINT,
                forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
              }
            : {}),
        },
      }),
    ]
  : []

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  editor: lexicalEditor(),
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  collections: [
    Admins,
    Media,
    Folders,
    Tags,
    Users,
    Assessments,
    NutritionPlans,
    FoodScans,
    MealLogs,
    ProgressEntries,
    ChatMessages,
    Subscriptions,
  ],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  storage,
})
