export const isDefined = <T>(x: T): x is NonNullable<T> => x != null;
