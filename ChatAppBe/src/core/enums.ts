// ============ USER ROLES ============
export enum UserRole {
  user = 'user',
  admin = 'admin',
  moderator = 'moderator',
}

// ============ GROUP MEMBER ROLES ============
export enum GroupMemberRole {
  owner = 'owner',
  admin = 'admin',
  member = 'member',
}

// Note: After running `npx prisma generate`, Prisma will also export these enums
// You can use either:
// - Import from '@prisma/client' (after generate)
// - Import from this file (always available)