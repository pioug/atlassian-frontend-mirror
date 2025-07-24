export type OncedFn<TFunc extends (this: any, ...args: any[]) => any> = (
	this: ThisParameterType<TFunc>,
	...args: Parameters<TFunc>
) => ReturnType<TFunc>;

/**
 * Creates a new function that will cache the result of it's first call.
 *
 * ```ts
 * function sayHello(name: string): string {
 *   return `Hello ${name}`;
 * }
 * const cached = once(sayHello);
 *
 * cached('Alex'); // returns "Hello Alex"
 * cached('Sam'); // returns "Hello Alex" (underlying `sayHello` function not called)
 * ```
 *
 * **Notes**
 *
 * - If the `onced` function throws, then the return value of the function is not cached
 * - Respects call site context (`this`) when executing the onced function
 */
export default function once<TFunc extends (...args: any[]) => any>(fn: TFunc): OncedFn<TFunc> {
	let cache: { value: ReturnType<TFunc> } | null = null;

	return function result(
		this: ThisParameterType<TFunc>,
		...args: Parameters<TFunc>
	): ReturnType<TFunc> {
		if (!cache) {
			cache = { value: fn.call(this, ...args) };
		}

		/**
		 * Intentionally not adding `.clear()` function property
		 *
		 * - We currently have no need for it
		 * - We don't want to add a `.clear()` to functions that should never be called twice,
		 *   for example: `cleanup` functions.
		 * - We can add a `onceWithCleanup` variant as a separate export from ds-lib if the
		 *   need arises 🧘
		 */

		return cache.value;
	};
}
