/**
 * A single inline style declaration.
 *
 * `TProperty` narrows the property name for callers that write a known, closed
 * set of properties. Narrowing it lets a record keyed on those same names be
 * checked for exhaustiveness at compile time, rather than silently resolving to
 * `undefined` for a name that was never mapped.
 */
export type TStyleDeclaration<TProperty extends string = string> = {
	property: TProperty;
	value: string;
};

/**
 * Sets inline styles on an element. Returns a cleanup function that restores the
 * prior inline values, so consumer styles are not lost.
 */
export function setStyle({
	element,
	styles,
}: {
	element: HTMLElement;
	styles: TStyleDeclaration[];
}): () => void {
	// Snapshot the prior INLINE value, not the computed style: cleanup restores
	// only what the consumer or an earlier run wrote inline. An empty string means
	// there was no inline value, so cleanup removes the property.
	const priorValues = styles.map(({ property }) => ({
		property,
		value: element.style.getPropertyValue(property),
	}));

	styles.forEach(({ property, value }) => {
		element.style.setProperty(property, value);
	});

	return function cleanup() {
		priorValues.forEach(({ property, value }) => {
			if (value === '') {
				element.style.removeProperty(property);
				return;
			}
			element.style.setProperty(property, value);
		});
	};
}
