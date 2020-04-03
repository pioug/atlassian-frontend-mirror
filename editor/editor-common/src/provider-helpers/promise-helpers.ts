export enum ResultStatus {
  FULFILLED = 'fulfilled',
  FAILED = 'failed',
}

type FulfiledResult<T> = {
  status: ResultStatus.FULFILLED;
  value: T;
};

type RejectedResult = {
  status: ResultStatus.FAILED;
  reason: any;
};

const isFullfilled = <T>(
  result: FulfiledResult<T> | RejectedResult,
): result is FulfiledResult<T> => result.status === ResultStatus.FULFILLED;

const markFullfilled = <T>(value: T): FulfiledResult<T> => ({
  status: ResultStatus.FULFILLED,
  value: value,
});

const markRejected = (error: any): RejectedResult => ({
  status: ResultStatus.FAILED,
  reason: error,
});

/**
 * Will wait for all promises to resolve or reject, wrapping their real results in
 * object containing the status so it's easy to filter it later. Loosely inspired by
 * [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
 * which can replace this implementation once it makes to the browsers.
 * @param promises
 */
export const waitForAllPromises = <T>(
  promises: Promise<T>[],
): Promise<(FulfiledResult<T> | RejectedResult)[]> => {
  return Promise.all(
    promises.map((result: Promise<T>) =>
      result.then(markFullfilled).catch(markRejected),
    ),
  );
};

/**
 * Will resolve on the first fulfilled promise and disregard the remaining ones. Similar to `Promise.race` but won't
 * care about rejected promises.
 * @param promises
 */
export const waitForFirstFulfilledPromise = <T>(
  promises: Promise<T>[],
): Promise<T> => {
  const rejectReasons: string[] = [];

  return new Promise((resolve, reject) => {
    promises.forEach((promise: Promise<T>) =>
      promise
        .then(value => {
          if (typeof value === 'undefined' || value === null) {
            throw new Error(
              `Result was not found but the method didn't reject/throw. Please ensure that it doesn't return null or undefined.`,
            );
          }

          resolve(value);
        })
        .catch(reason => {
          rejectReasons.push(reason);
          if (rejectReasons.length === promises.length) {
            reject(reason);
          }
        }),
    );
  });
};

/**
 * Find all fullfilled promises and return their values
 * @param results
 */
export const getOnlyFulfilled = <T>(
  results: (FulfiledResult<T> | RejectedResult)[],
): T[] => results.filter(isFullfilled).map(result => result.value);
