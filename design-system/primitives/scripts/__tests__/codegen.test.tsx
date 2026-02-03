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
		const output = createSpacingStylesFromTemplate();
		expect(output).toContain('export type Space = keyof typeof positiveSpaceMap;');
		expect(output).toContain('export type NegativeSpace = keyof typeof negativeSpaceMap;');
		expect(output).toContain('export type AllSpace = keyof typeof allSpaceMap;');
	});

	test('incorrect config throws', () => {
		expect(() => createColorStylesFromTemplate('fizzbuzz' as any)).toThrowError();
		expect(() => createElevationStylesFromTemplate('fizzbuzz' as any)).toThrowError();
	});
});
