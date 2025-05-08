/**
 * A factory function to create a conditional hook. The condition must return a boolean value
 * that does not change after initialisation. This function will cache the result of the condition
 * and use it to determine which hook to call. If the condition changes between renders,
 * unexpected behaviour may occur.
 *
 * **This hook should only be used for Feature Gates & Experiments where the value doesn't change.**
 * ```ts
 * // Acceptable use
 * const useMyHook = conditionalHooksFactory(
 *   () => isFeatureEnabled('my-feature'),
 *   useMyNewHook,
 *   useMyOldHook,
 * );
 *
 * // Not acceptable use
 * const useMyHook = conditionalHooksFactory(
 *    () => someVarThatCouldChange === 'my-value',
 *    useMyNewHook,
 *    useMyOldHook,
 * );
 * ```
 *
 * @param condition The condition function that will be used to determine which hook to call.
 * @param newHook The new hook to call if the condition is true.
 * @param oldHook The old hook to call if the condition is false.
 * @returns A migrator hook that will call either the new hook or the old hook based on the condition.
 */
export function conditionalHooksFactory<Result, A>(
	condition: () => boolean,
	newHook: (...args: A[]) => Result,
	oldHook: (...args: A[]) => Result,
): (...args: A[]) => Result {
	// Since we are conditionally rendering hooks, we need to ensure the condition result won't change
	// between renders. We can do this by caching the result of the condition.
	let conditionCache: boolean | null = null;

	return (...args: A[]) => {
		const conditionResult = condition(); // call each time so we can track exposures
		if (conditionCache === null) {
			conditionCache = conditionResult;
		}

		// Extra level of safety for dev environement to
		// notify devs of changed condition
		if (process.env.NODE_ENV !== 'production') {
			if (conditionCache !== conditionResult) {
				throw new Error(
					'Conditional hook called with different condition, this breaks the rules of hooks!',
				);
			}
		}

		if (conditionCache) {
			return newHook(...args);
		} else {
			return oldHook(...args);
		}
	};
}
