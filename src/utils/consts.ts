type ValueOf<T> = T[keyof T]

export const Environment = {
  PORT: "PORT"
} as const;

type Environment = ValueOf<typeof Environment>
