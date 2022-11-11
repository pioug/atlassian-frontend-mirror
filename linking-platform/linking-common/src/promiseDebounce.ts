/**
 * Given a callback function returns a promise that resolves to the result of calling the callback function but is
 * debounced (execution is cancelled and promise will remain pending if `promiseDebounce` is re-called within the `time` interval)
 * @param cb Callback which returns result to be resolved
 * @param time Debounce interval
 * @returns Function that returns debounced promise
 */
export function promiseDebounce<
  Args extends unknown[],
  ResolveType extends unknown
>(cb: (...args: Args) => Promise<ResolveType>, time: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  // Returns a promise that fires the debounce fn and pushes a resolver
  // to have the debounced result resolved
  return (...args: Args) => {
    timeoutId && clearTimeout(timeoutId);
    return new Promise<ResolveType>((resolve, reject) => {
      timeoutId = setTimeout(() => {
        cb(...args)
          .then(resolve)
          .catch(reject);
      }, time);
    });
  };
}
