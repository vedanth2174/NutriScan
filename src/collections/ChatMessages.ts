import type { CollectionConfig } from 'payload'
import { appUserOnly, ownDocuments, serverOwnedField, setOwner } from './access'

export const ChatMessages: CollectionConfig = {
  slug: 'chat-messages',
  admin: { group: 'NutriScan', useAsTitle: 'threadId' },
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
    { name: 'threadId', type: 'text', required: true, index: true },
    { name: 'role', type: 'select', required: true, options: ['user', 'assistant'] },
    { name: 'content', type: 'textarea', required: true },
    { name: 'citations', type: 'json' },
    { name: 'confidence', type: 'number', min: 0, max: 100 },
  ],
}
