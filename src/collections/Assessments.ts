import type { CollectionConfig } from 'payload'
import { appUserOnly, ownDocuments, serverOwnedField, setOwner } from './access'

export const Assessments: CollectionConfig = {
  slug: 'assessments',
  admin: { group: 'NutriScan', useAsTitle: 'createdAt' },
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
    { name: 'responses', type: 'json', required: true },
    { name: 'goal', type: 'text' },
    { name: 'healthConditions', type: 'json' },
    { name: 'allergies', type: 'json' },
  ],
}
