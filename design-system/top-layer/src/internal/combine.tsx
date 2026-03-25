/**
 * Combine multiple cleanup functions into a single cleanup function.
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
	return function cleanup(): void {
		cleanupFns.forEach((fn) => fn?.());
	};
}
