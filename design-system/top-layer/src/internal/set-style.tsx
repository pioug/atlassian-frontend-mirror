/**
 * Sets inline styles on an element and returns a cleanup function
 * that removes only the styles that were applied.
 *
 * Uses `style.setProperty()` / `style.removeProperty()` so that
 * hyphenated CSS property names (e.g. `position-area`, `anchor-name`)
 * work correctly. These newer properties do not have camelCase
 * mappings in `CSSStyleDeclaration` yet.
 *
 * @example
 * ```ts
 * const cleanup = setStyle({ el: popover, styles: [
 *   { property: 'position-anchor', value: '--my-anchor' },
 *   { property: 'position-area', value: 'block-end' },
 *   { property: 'margin', value: '0' },
 * ] });
 *
 * // Later: removes all three properties
 * cleanup();
 * ```
 */
export function setStyle({
	el,
	styles,
}: {
	el: HTMLElement;
	styles: Array<{ property: string; value: string }>;
}): () => void {
	styles.forEach(({ property, value }) => {
		el.style.setProperty(property, value);
	});

	return function cleanup(): void {
		styles.forEach(({ property }) => {
			el.style.removeProperty(property);
		});
	};
}
