import type { CollectionConfig } from 'payload'
import { ownDocuments, serverOwnedField } from './access'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: { group: 'NutriScan', useAsTitle: 'providerCustomerId' },
  access: {
    create: () => false,
    delete: () => false,
    read: ownDocuments,
    update: () => false,
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      index: true,
      access: { create: serverOwnedField, update: serverOwnedField },
    },
    { name: 'provider', type: 'select', required: true, options: ['stripe', 'manual'] },
    { name: 'providerCustomerId', type: 'text', index: true },
    { name: 'providerSubscriptionId', type: 'text', unique: true, index: true },
    { name: 'tier', type: 'select', required: true, options: ['free', 'pro'] },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: ['inactive', 'trialing', 'active', 'past_due', 'canceled'],
    },
    { name: 'currentPeriodEnd', type: 'date' },
  ],
}
