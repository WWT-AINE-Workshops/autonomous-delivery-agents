// The API has no users endpoint yet, so the board knows the three seeded people by id.
export const USERS: Record<number, string> = {
  1: 'Mira Castillo',
  2: 'Theo Lindqvist',
  3: 'Noor Haddad',
};

export const userName = (id: number | null): string =>
  id === null ? 'Unassigned' : (USERS[id] ?? `User ${id}`);
