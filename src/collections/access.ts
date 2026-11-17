import type { Access, FieldAccess } from 'payload'

const isAppUser = (user: unknown): user is { id: string | number; collection: 'users' } =>
  Boolean(
    user &&
    typeof user === 'object' &&
    'id' in user &&
    'collection' in user &&
    user.collection === 'users',
  )

export const appUserOnly: Access = ({ req }) => isAppUser(req.user)

export const ownDocuments: Access = ({ req }) =>
  isAppUser(req.user) ? { owner: { equals: req.user.id } } : false

export const ownProfile: Access = ({ req }) =>
  isAppUser(req.user) ? { id: { equals: req.user.id } } : false

export const serverOwnedField: FieldAccess = () => false

export const setOwner = ({
  data,
  req,
}: {
  data: Record<string, unknown>
  req: { user?: unknown }
}) => {
  if (isAppUser(req.user)) data.owner = req.user.id
  return data
}
