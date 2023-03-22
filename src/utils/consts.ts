type ValueOf<T> = T[keyof T];

export const Environment = {
  PORT: "PORT",
  SESSION_SECRET: "SESSION_SECRET",
} as const;

type Environment = ValueOf<typeof Environment>;
