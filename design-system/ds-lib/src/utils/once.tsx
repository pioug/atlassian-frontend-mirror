// Copy pasted from https://github.com/alexreardon/limit-once/blob/main/src/once.ts

export type OncedFn<TFunc extends (this: any, ...args: any[]) => any> = {
	/**
	 * Clear the cached result.
	 * Allow the wrapped function (`TFunc`) to be called again
	 */
	clear: () => void;
	(this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>): ReturnType<TFunc>;
};

/**
 * Creates a new function that will cache the result of it's first call.
 *
 * @example
 * function sayHello(name: string): string {
 *   return `Hello ${name}`;
 * }
 * const cached = once(sayHello);
 *
 * cached('Alex'); // returns "Hello Alex"
 * cached('Sam'); // returns "Hello Alex" (underlying `sayHello` function not called)
 */
export default function once<TFunc extends (...args: any[]) => any>(fn: TFunc): OncedFn<TFunc> {
	let cache: { value: ReturnType<TFunc> } | null = null;

	function result(this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>): ReturnType<TFunc> {
		if (!cache) {
			cache = { value: fn.call(this, ...args) };
		}
		return cache.value;
	}

	result.clear = function clear() {
		cache = null;
	};

	return result;
}
