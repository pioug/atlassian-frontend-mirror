/**
 * Converts a camelCased CSS property name to a hyphenated CSS property name.
 *
 * @param property - CamelCased CSS property name.
 * @returns Hyphenated CSS property name.
 */
function hyphenate(property: string): string {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`).replace(/^ms/, '-ms');
}

/**
 * Converts a CSS properties object to a CSS string.
 * @param properties - CSS properties object.
 * @returns CSS string.
 */
export function convertToInlineCss(
	properties: React.CSSProperties | Record<`--${string}`, string>,
): string {
	const cssString = Object.entries(properties)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(
			([property, value]) =>
				`${property.startsWith('--') ? property : hyphenate(property)}: ${value};`,
		)
		.join(' ');

	return cssString;
}
