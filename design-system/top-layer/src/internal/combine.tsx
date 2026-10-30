/**
 * Combines cleanup functions into one cleanup function. It calls them in order and skips
 * `undefined` entries.
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   return combine(
 *     bind(window, { type: 'resize', listener: onResize }),
 *     bind(window, { type: 'scroll', listener: onScroll, options: { capture: true } }),
 *   );
 * }, []);
 * ```
 */
export function combine(...cleanupFns: ((() => void) | undefined)[]): () => void {
	return function cleanup() {
		cleanupFns.forEach((cleanupFn) => cleanupFn?.());
	};
}
