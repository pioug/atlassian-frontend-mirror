/**
 * Sets an attribute on an element and returns a cleanup function that removes it.
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   return combine(
 *     setAttribute({ element, name: 'data-example', value: '' }),
 *     bind(window, { type: 'keydown', listener: onKeyDown }),
 *   );
 * }, []);
 * ```
 */
export function setAttribute({
	element,
	name,
	value,
}: {
	element: Element;
	name: string;
	value: string;
}): () => void {
	element.setAttribute(name, value);
	return function cleanup() {
		element.removeAttribute(name);
	};
}
