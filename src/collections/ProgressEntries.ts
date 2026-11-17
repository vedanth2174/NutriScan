import type { CollectionConfig } from 'payload'
import { appUserOnly, ownDocuments, serverOwnedField, setOwner } from './access'

export const ProgressEntries: CollectionConfig = {
  slug: 'progress-entries',
  admin: { group: 'NutriScan', useAsTitle: 'metric' },
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
    { name: 'recordedAt', type: 'date', required: true, index: true },
    {
      name: 'metric',
      type: 'select',
      required: true,
      options: [
        'weight',
        'water',
        'steps',
        'sleep',
        'energy',
        'calories',
        'protein',
        'carbs',
        'fat',
        'fiber',
      ],
    },
    { name: 'value', type: 'number', required: true },
    { name: 'unit', type: 'text', required: true },
    { name: 'notes', type: 'textarea' },
  ],
}
