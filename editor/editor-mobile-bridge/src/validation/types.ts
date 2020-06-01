export type ValidationResult<E, T> = ValidationError<E> | ValidationSuccess<T>;

type ValidationError<E> = { readonly error: E; readonly data: null };
type ValidationSuccess<T> = { readonly error: null; readonly data: T };
