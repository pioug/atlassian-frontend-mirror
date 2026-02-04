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
});
