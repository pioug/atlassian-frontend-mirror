import invariant from 'tiny-invariant';
/**
 * Same API as `Promise.withResolvers()` which allows us to get the same
 * outcomes before including `"ES2024.Promise"` in `tsconfig.json: "lib"`
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers.
 *
 * Does not support `.call()` on `withResolvers` with non-promise constructors
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers#calling_withresolvers_on_a_non-promise_constructor
 */
export function withResolvers<TValue>(): {
	promise: Promise<TValue>;
	resolve: (value: TValue | PromiseLike<TValue>) => void;
	reject: (reason?: any) => void;
} {
	let resolve;
	let reject;

	const promise = new Promise<TValue>((res, rej) => {
		// Promise constructors run synchronously,
		// so `resolve` and `reject` will be set before the
		// invariants run
		resolve = res;
		reject = rej;
	});

	// to make sure types are correctly narrowed
	invariant(resolve);
	invariant(reject);

	return { resolve, reject, promise };
}
