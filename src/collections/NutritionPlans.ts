import type { CollectionConfig } from 'payload'
import { appUserOnly, ownDocuments, serverOwnedField, setOwner } from './access'

export const NutritionPlans: CollectionConfig = {
  slug: 'nutrition-plans',
  admin: { group: 'NutriScan', useAsTitle: 'name' },
  access: {
    create: appUserOnly,
    delete: ownDocuments,
    read: ownDocuments,
    update: ownDocuments,
  },
  hooks: { beforeChange: [setOwner] },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { create: serverOwnedField, update: serverOwnedField },
    },
    { name: 'name', type: 'text', required: true, defaultValue: 'My nutrition plan' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'completed', 'paused', 'archived'],
    },
    { name: 'startsOn', type: 'date', required: true },
    { name: 'endsOn', type: 'date' },
    { name: 'targets', type: 'json', required: true },
    { name: 'days', type: 'json', required: true },
    { name: 'groceryList', type: 'json' },
    { name: 'supplements', type: 'json' },
    { name: 'lifestyle', type: 'json' },
  ],
}
