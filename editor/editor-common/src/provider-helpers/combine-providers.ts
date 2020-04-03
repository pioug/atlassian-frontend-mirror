import {
  getOnlyFulfilled,
  waitForAllPromises,
  waitForFirstFulfilledPromise,
} from './promise-helpers';

const flatten = <T>(arr: T[][]): T[] => ([] as T[]).concat(...arr);

/**
 * Allow to run methods from the given provider interface across all providers seamlessly.
 * Handles promise racing and discards rejected promises safely.
 */
export default <P>(providers: (P | Promise<P>)[]) => {
  if (providers.length === 0) {
    throw new Error('At least one provider must be provided');
  }

  const getFulfilledProviders = async () => {
    const results = await waitForAllPromises<P>(
      providers.map(result => Promise.resolve(result)),
    );

    return getOnlyFulfilled<P>(results);
  };

  const runInAllProviders = async <T>(
    mapFunction: (provider: P) => Promise<T>,
  ) => {
    return (await getFulfilledProviders()).map(provider =>
      mapFunction(provider),
    );
  };

  const createCallback = (methodName: keyof P, args?: any[]) => (
    provider: P,
  ) => {
    const method = provider[methodName];

    if (typeof method === 'function') {
      return method.apply(provider, args);
    }

    throw new Error(`"${methodName}" isn't a function of the provider`);
  };

  /**
   * Run a method from the provider which expects to return a single item
   * @param methodName
   * @param args
   */
  const invokeSingle = async <T>(methodName: keyof P, args?: any[]) => {
    const callback = createCallback(methodName, args);

    return waitForFirstFulfilledPromise<T>(await runInAllProviders(callback));
  };

  /**
   * Run a method in the provider which expectes to return a list of items
   * @param methodName
   * @param args
   */
  const invokeList = async <T>(methodName: keyof P, args?: any[]) => {
    const callback = createCallback(methodName, args);
    const results = await waitForAllPromises<T[]>(
      await runInAllProviders(callback),
    );
    const fulfilledResults = getOnlyFulfilled<T[]>(results);

    return flatten<T>(fulfilledResults).filter(result => result);
  };

  return {
    invokeSingle,
    invokeList,
  };
};
