// This file includes some global types that are declared but not exposed externally
// This file doesn't need to be imported

// Remove types from T that are assignable to U
declare type Diff<T, U> = T extends U ? never : T;

// A imperfect workaround to represent variadic parameters (varargs) in typescript
declare type Varargs = (
  | string
  | number
  | boolean
  | undefined
  | null
  | void
  | {}
)[];
