import { createSpacingStylesFromTemplate } from '../spacing-codegen-template';

describe('@atlaskit/eslint-plugin-design-system', () => {
	// spacing
	test('spacing styles are generated correctly', () => {
		const output = createSpacingStylesFromTemplate();
		expect(output).toContain('export const positiveSpaceMap');
		expect(output).toContain('export type Space');
		expect(output).toContain('export const negativeSpaceMap');
		expect(output).toContain('export type NegativeSpace');
		expect(output).toContain('export const allSpaceMap');
		expect(output).toContain('export type AllSpace');
	});

	test('spacing maps preserve numeric tokens when gap aliases share the same value', () => {
		const output = createSpacingStylesFromTemplate();

		expect(output).not.toContain('space.gap.');
		for (const [value, token] of [
			['2px', 'space.025'],
			['4px', 'space.050'],
			['6px', 'space.075'],
			['8px', 'space.100'],
			['12px', 'space.150'],
			['16px', 'space.200'],
			['24px', 'space.300'],
		]) {
			expect(output).toContain(`'${value}': '${token}'`);
		}
	});
});
