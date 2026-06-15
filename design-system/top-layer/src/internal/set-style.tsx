/**
 * Sets inline styles on an element and returns a cleanup function that
 * restores the prior inline values (so we do not stomp consumer styles).
 */
export function setStyle({
	element,
	styles,
}: {
	element: HTMLElement;
	styles: Array<{ property: string; value: string }>;
}): () => void {
	// Snapshot the prior inline value (NOT the computed style - we only want
	// to restore values that the consumer/our previous run inlined). An empty
	// string means "no inline value", in which case cleanup uses removeProperty.
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
