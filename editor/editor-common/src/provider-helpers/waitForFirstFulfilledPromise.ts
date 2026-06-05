/**
 * Will resolve on the first fulfilled promise and disregard the remaining ones. Similar to `Promise.race` but won't
 * care about rejected promises.
 * @param promises
 */
export const waitForFirstFulfilledPromise = <T>(promises: Promise<T>[]): Promise<T> => {
	const rejectReasons: string[] = [];

	return new Promise((resolve, reject) => {
		promises.forEach((promise: Promise<T>) =>
			promise
				.then((value) => {
					if (typeof value === 'undefined' || value === null) {
						throw new Error(
							`Result was not found but the method didn't reject/throw. Please ensure that it doesn't return null or undefined.`,
						);
					}

					resolve(value);
				})
				.catch((reason) => {
					rejectReasons.push(reason);
					if (rejectReasons.length === promises.length) {
						reject(reason);
					}
				}),
		);
	});
};
