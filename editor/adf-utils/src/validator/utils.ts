export const isDefined = <T>(x: T): x is NonNullable<T> => x != null;

export const isNumber = (x: unknown): x is number =>
  typeof x === 'number' && !isNaN(x) && isFinite(x);

export const isInteger = (x: unknown): x is number =>
  typeof x === 'number' && isFinite(x) && Math.floor(x) === x;

export const isBoolean = (x: unknown): x is boolean =>
  x === true || x === false || toString.call(x) === '[object Boolean]';

// This is a kludge, might replace with something like _.isString in future
export const isString = (s: unknown): s is string =>
  typeof s === 'string' || s instanceof String;

export const isPlainObject = (x: unknown) =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

export const copy = <
  T extends Record<string | number, any> = Record<string | number, any>
>(
  source: Record<string | number, any>,
  dest: T,
  key: string | number,
) => {
  (dest as Record<string | number, any>)[key] = source[key];
  return dest;
};

// Helpers
export const makeArray = <T>(maybeArray: T | Array<T>) =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray];
