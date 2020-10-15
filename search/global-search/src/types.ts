// Remove types from T that are assignable to U
export type Diff<T, U> = T extends U ? never : T;

// A imperfect workaround to represent variadic parameters (varargs) in typescript
export type Varargs = (
  | string
  | number
  | boolean
  | undefined
  | null
  | void
  | {}
)[];
