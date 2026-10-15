import { createColorStylesFromTemplate } from '../color-codegen-template';
import { createElevationStylesFromTemplate } from '../elevation-codegen-template';
import { createSpacingStylesFromTemplate } from '../spacing-codegen-template';

describe('@atlaskit/primitives', () => {
	// colour stuff
	test('text styles are generated correctly', () => {
		expect(createColorStylesFromTemplate('text')).toContain(
			'export type TextColor = keyof typeof textColorMap;',
		);
	});
	test('background styles are generated correctly', () => {
		expect(createColorStylesFromTemplate('background')).toContain(
			'export type BackgroundColor = keyof typeof backgroundColorMap;',
		);
	});
	test('border styles are generated correctly', () => {
		expect(createColorStylesFromTemplate('border')).toContain(
			'export type BorderColor = keyof typeof borderColorMap;',
		);
	});

	// elevation stuff
	test('opacity styles are generated correctly', () => {
		expect(createElevationStylesFromTemplate('opacity')).toContain(
			'export type Opacity = keyof typeof opacityMap;',
		);
	});
	test('shadow styles are generated correctly', () => {
		expect(createElevationStylesFromTemplate('shadow')).toContain(
			'export type Shadow = keyof typeof shadowMap;',
		);
	});
	test('surface styles are generated correctly', () => {
		expect(createElevationStylesFromTemplate('surface')).toContain(
			'export type SurfaceColor = keyof typeof surfaceColorMap;',
		);
	});

	// spacing
	test('spacing styles are generated correctly', () => {
		expect(createSpacingStylesFromTemplate('positive')).toContain(
			'export type Space = keyof typeof positiveSpaceMap;',
		);
		expect(createSpacingStylesFromTemplate('negative')).toContain(
			'export type NegativeSpace = keyof typeof negativeSpaceMap;',
		);
		expect(createSpacingStylesFromTemplate('all')).toContain(
			'export type AllSpace = keyof typeof allSpaceMap;',
		);
	});

	test.each(['positive', 'all'] as const)(
		'%s spacing styles keep gap tokens out of numeric spacing maps',
		(property) => {
			const styles = createSpacingStylesFromTemplate(property);
			expect(styles).toContain("'space.100':");
			expect(styles).not.toContain('space.gap.');
		},
	);

	test('semantic gap tokens are restricted to the gap map', () => {
		const gapStyles = createSpacingStylesFromTemplate('gap');
		expect(gapStyles).toContain('export type GapSpace = keyof typeof gapSpaceMap;');
		expect(gapStyles).toContain("'space.100'");
		expect(gapStyles).not.toContain('space.negative.');
		for (const size of ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge']) {
			expect(gapStyles).toContain(`'space.gap.${size}'`);
		}
		for (const property of ['positive', 'negative', 'all'] as const) {
			expect(createSpacingStylesFromTemplate(property)).not.toContain('space.gap.');
		}
	});

	test('incorrect config throws', () => {
		expect(() => createColorStylesFromTemplate('fizzbuzz' as any)).toThrow();
		expect(() => createElevationStylesFromTemplate('fizzbuzz' as any)).toThrow();
	});
});
