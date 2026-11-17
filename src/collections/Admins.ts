import type { Access, CollectionConfig } from 'payload'

const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Admins: CollectionConfig = {
  slug: 'admins',
  access: {
    create: async ({ req }) => {
      const existingAdmins = await req.payload.find({
        collection: 'admins',
        limit: 1,
        overrideAccess: true,
      })
      return existingAdmins.totalDocs === 0 || Boolean(req.user && req.user.collection === 'admins')
    },
    delete: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
  },
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [],
  versions: false,
}
