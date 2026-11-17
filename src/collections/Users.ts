import type { CollectionConfig } from 'payload'
import { ownProfile } from './access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'NutriScan',
    hidden: true,
    useAsTitle: 'email',
  },
  access: {
    admin: () => false,
    create: () => true,
    delete: ownProfile,
    read: ownProfile,
    update: ownProfile,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'googleProviderId',
      type: 'text',
      unique: true,
      index: true,
      access: { create: () => false, update: () => false },
    },
    { name: 'avatarURL', type: 'text' },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'dark',
      options: ['dark', 'light', 'system'],
    },
    { name: 'onboardingComplete', type: 'checkbox', defaultValue: false },
    {
      name: 'nutritionProfile',
      type: 'group',
      fields: [
        { name: 'goal', type: 'text' },
        { name: 'dietaryPreference', type: 'text' },
        { name: 'healthConditions', type: 'json' },
        { name: 'allergies', type: 'json' },
        { name: 'dailyCalories', type: 'number', min: 800, max: 6000 },
        { name: 'proteinTarget', type: 'number', min: 0, max: 500 },
        { name: 'carbsTarget', type: 'number', min: 0, max: 1000 },
        { name: 'fatTarget', type: 'number', min: 0, max: 500 },
        { name: 'waterTargetMl', type: 'number', min: 0, max: 10000 },
      ],
    },
  ],
  versions: false,
}
