import { dynamicColor, dynamicColorCustomProperties } from '../../_formulas';

const expand = (value: string): string => {
	let expanded = value;
	let previous;
	while (previous !== expanded) {
		previous = expanded;
		expanded = expanded.replace(/var\((--ds-dynamic-color-[a-z-]+)\)/g, (_, property: string) => {
			const customProperty = dynamicColorCustomProperties.find((p) => p.property === property);
			if (!customProperty) {
				throw new Error(`Unknown custom property ${property}`);
			}
			return customProperty.value;
		});
	}
	return expanded;
};

describe('dynamicColorCustomProperties', () => {
	it('should expand each declared value to its resolved value', () => {
		dynamicColorCustomProperties.forEach(({ value, resolvedValue }) => {
			expect(expand(value)).toBe(resolvedValue);
		});
	});

	it('should only reference custom properties declared earlier', () => {
		dynamicColorCustomProperties.forEach(({ value }, index) => {
			const declaredBefore = dynamicColorCustomProperties.slice(0, index).map((p) => p.property);
			[...value.matchAll(/var\((--ds-dynamic-color-[a-z-]+)\)/g)].forEach(([, property]) => {
				expect(declaredBefore).toContain(property);
			});
		});
	});

	it('should have unique properties and resolved values', () => {
		const properties = dynamicColorCustomProperties.map((p) => p.property);
		const resolvedValues = dynamicColorCustomProperties.map((p) => p.resolvedValue);
		expect(new Set(properties).size).toBe(properties.length);
		expect(new Set(resolvedValues).size).toBe(resolvedValues.length);
	});

	it('should cover every derived dynamic colour', () => {
		const resolvedValues = dynamicColorCustomProperties.map((p) => p.resolvedValue);
		Object.values(dynamicColor)
			.filter((value) => !String(value).startsWith('var(--ds-dynamic-'))
			.forEach((value) => {
				expect(resolvedValues).toContain(value);
			});
	});
});
