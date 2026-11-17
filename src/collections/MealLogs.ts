import type { CollectionConfig } from 'payload'
import { appUserOnly, ownDocuments, serverOwnedField, setOwner } from './access'

export const MealLogs: CollectionConfig = {
  slug: 'meal-logs',
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
    { name: 'name', type: 'text', required: true },
    {
      name: 'mealType',
      type: 'select',
      options: ['breakfast', 'lunch', 'dinner', 'snack'],
    },
    { name: 'eatenAt', type: 'date', required: true, index: true },
    { name: 'portionGrams', type: 'number', min: 0 },
    { name: 'nutrition', type: 'json', required: true },
    { name: 'scan', type: 'relationship', relationTo: 'food-scans' },
  ],
}
