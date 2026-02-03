import { createColorStylesFromTemplate } from '../color-codegen-template';
import { createInteractionStylesFromTemplate } from '../interaction-codegen';
describe('@atlaskit/design-system-explorations', () => {
	test('text styles are generated correctly', () => {
		expect(createColorStylesFromTemplate('text')).toContain(
			'export type TextColor = keyof typeof textColorMap;',
		);
	});

	test('bg styles are generated correctly', () => {
		expect(createColorStylesFromTemplate('background')).toContain(
			'export type BackgroundColor = keyof typeof backgroundColorMap;',
		);
	});

	test('border styles are generated correctly', () => {
		expect(createColorStylesFromTemplate('border')).toContain(
			'export type BorderColor = keyof typeof borderColorMap;',
		);
	});

	test('border styles are generated correctly', () => {
		expect(createInteractionStylesFromTemplate('background')).toContain(
			'type InteractionBackgroundColor',
		);
		expect(createInteractionStylesFromTemplate('background')).toContain(
			'const backgroundActiveColorMap: Record<InteractionBackgroundColor, SerializedStyles>',
		);
		expect(createInteractionStylesFromTemplate('background')).toContain(
			'const backgroundHoverColorMap: Record<InteractionBackgroundColor, SerializedStyles>',
		);
	});

	test('incorrect config throws', () => {
		expect(() => createColorStylesFromTemplate('fizzbuzz' as any)).toThrowError();
	});
});
