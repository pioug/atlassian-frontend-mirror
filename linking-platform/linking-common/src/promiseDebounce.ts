import debounce from 'lodash/debounce';

/**
 * Given a callback function returns a promise that resolves to the result of calling the callback function but is
 * debounced. Calling the returned function will return a new promise but each promise will resolve to the return value
 * of this single callback call
 * @param cb Callback which returns result to be resolved
 * @param time Debounce interval
 * @returns Function that returns debounced promise
 */
export function promiseDebounce<
  Args extends unknown[],
  ResolveType extends unknown
>(cb: (...args: Args) => Promise<ResolveType>, time: number) {
  // Setup array of resolves/rejects to promise a result to
  let resolvers: Array<(res: ResolveType) => void> = [];
  let rejectors: Array<(reason: any) => void> = [];

  // The function to be debounced and only run after x interval
  // Once called await the promise that will yield our results and
  // resolve all resolvers with the value
  const fn = async (...args: Args) => {
    try {
      const result = await cb(...args);

      for (const resolve of resolvers) {
        resolve(result);
      }
    } catch (err: unknown) {
      for (const reject of rejectors) {
        reject(err);
      }
    }

    // clean up arrays after execution
    resolvers = [];
    rejectors = [];
  };

  const debounced = debounce(fn, time);

  // Returns a promise that fires the debounce fn and pushes a resolver
  // to have the debounced result resolved
  return (...args: Args) =>
    new Promise<ResolveType>((resolve, reject) => {
      resolvers.push(resolve);
      rejectors.push(reject);
      debounced(...args);
    });
}
