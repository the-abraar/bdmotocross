export const USERNAME_REGEX = /^[a-z0-9_]{3,32}$/;

export function validateUsername(username: string): boolean {
  if (!username) return false;
  return USERNAME_REGEX.test(username.trim());
}

export function resolveUserEmail(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes("@")) {
    return trimmed;
  }
  return `${trimmed}@members.bdmotocross.com`;
}
