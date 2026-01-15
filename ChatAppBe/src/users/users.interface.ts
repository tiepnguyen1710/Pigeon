export interface IUser {
  id: bigint | string; // BigInt from DB, string from JWT
  username: string;
  email: string;
  role: string;
  age?: number;
  gender?: string;
}

// Helper to convert id for JWT (BigInt cannot be serialized to JSON)
export function serializeUserId(id: bigint): string {
  return id.toString();
}

export function deserializeUserId(id: string): bigint {
  return BigInt(id);
}