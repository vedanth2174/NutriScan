import type { CollectionConfig } from 'payload'
import { appUserOnly, ownDocuments, serverOwnedField, setOwner } from './access'

export const FoodScans: CollectionConfig = {
  slug: 'food-scans',
  admin: { group: 'NutriScan', useAsTitle: 'foodName' },
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
    {
      name: 'mode',
      type: 'select',
      required: true,
      options: ['camera', 'barcode', 'label', 'gallery', 'voice', 'text'],
    },
    { name: 'barcode', type: 'text', index: true },
    { name: 'foodName', type: 'text', required: true },
    { name: 'brand', type: 'text' },
    { name: 'result', type: 'json', required: true },
    { name: 'personalizedScore', type: 'number', min: 1, max: 100 },
  ],
}
