export const isPromise = <T>(p: T | Promise<T>): p is Promise<T> =>
  p && typeof (<Promise<T>>p).then === 'function';
