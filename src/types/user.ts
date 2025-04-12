export type User = {
  id: string;
  username: string;
  password: string;
};

export const DEFAULT_USERS: User[] = [
  { id: "1", username: "john", password: "password123" },
  { id: "2", username: "jane", password: "password456" },
];
