type Func = (...args: any[]) => any;
type ProxyFunc<F extends Func> = F & { [K in keyof F]: F[K] };
type Resolve<T> = T extends Promise<infer U> ? U : T;

export const RELEASE_RESOLVED_PROMISE_DELAY = 5000;

const isPromise = <T>(p: any): p is Promise<T> => {
  return typeof p.then === 'function' && typeof p.catch === 'function';
};

export type WithCached<F extends Func> = ProxyFunc<F> & {
  cached: (...args: Parameters<F>) => Resolve<ReturnType<F>> | void;
  reset: () => void;
};

/**
 * withCached wraps a function and keeps track of in-flight promises:
 *
 * 1. First call will result to normal invocation. After promise is resolved
 * it will be removed from the promise-cache and store value into result-cache.
 *
 * 2. Second and subsequent calls will:
 *    a) return unresolved promise if any
 *    b) do a normal invocation otherwise
 *
 * 3. Provides methods to get `cached` value and `reset` caches
 */
export const withCached = <F extends Func>(fn: F): WithCached<F> => {
  const resultCache = new Map<string, Resolve<ReturnType<F>>>();
  const promiseCache = new Map<string, ReturnType<F>>();

  function getCacheKey(...args: Parameters<F>) {
    return JSON.stringify(args);
  }

  const cached = (...args: Parameters<F>) => {
    const cacheKey = getCacheKey(...args);
    return resultCache.get(cacheKey);
  };

  const reset = () => {
    resultCache.clear();
    promiseCache.clear();
  };

  const execute = (...args: Parameters<F>): ReturnType<F> => {
    const cacheKey = getCacheKey(...args);

    const cachedPromise = promiseCache.get(cacheKey);
    if (cachedPromise !== undefined) {
      return cachedPromise;
    }

    const maybePromise = fn(...args);
    promiseCache.set(cacheKey, maybePromise);

    if (isPromise<Resolve<ReturnType<F>>>(maybePromise)) {
      maybePromise
        .then(result => {
          resultCache.set(cacheKey, result);
          setTimeout(
            () => promiseCache.delete(cacheKey),
            RELEASE_RESOLVED_PROMISE_DELAY,
          );
        })
        .catch(() => {
          promiseCache.delete(cacheKey);
        });
    }

    return maybePromise;
  };

  return Object.assign(execute, fn, {
    cached,
    reset,
  });
};
