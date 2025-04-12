export interface User {
  username: string;
  password: string;
  role: "tutor" | "lecturer";
}

export const DEFAULT_USERS: User[] = [
  {
    username: "lecturer@example.com",
    password: "lecturer123",
    role: "lecturer",
  },
  {
    username: "tutor@example.com",
    password: "tutor123",
    role: "tutor",
  },
];
