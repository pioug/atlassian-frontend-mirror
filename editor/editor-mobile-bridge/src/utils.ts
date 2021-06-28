export function hasValue(str?: string): boolean {
  return !!str && str.length > 0;
}

export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';
export const IS_DUMMY = !window.webkit && !window.promiseBridge;
export const IS_ATLASKIT = process.env.IS_ATLASKIT === 'true';

export interface DeferredValue<T> extends Promise<T> {
  resolve(v: T): void;
}

/**
 * `createDeferred` will be handy for when we want to resolve a promise externally.
 * The way this is done, is by creating a dummy promise, storing the `resolve` function
 * on scope, and assign that resolve method to the promise instance.
 *
 * Example:
 * `const deferred = createDeferred()` deferred is a promise instance, with a `resolve` method.
 * We can use deferred wherever we want to read values in the future, but we can't at the moment.
 * Eventually, `deferred.resolve('somevalue')` will be called and any consumer of deferred promise will
 * get the resolved value.
 */
export const createDeferred = <T>(): DeferredValue<T> => {
  let resolve = (value: T) => {};
  let isResolved = false;
  const p = new Promise((r) => (resolve = r));
  (p as any).resolve = (value: T) => {
    if (!isResolved) {
      isResolved = true;
      resolve(value);
    }
  };
  return p as DeferredValue<T>;
};
