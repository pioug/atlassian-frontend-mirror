import { createColorStylesFromTemplate } from '../color-codegen-template';
import { createInteractionStylesFromTemplate } from '../interaction-codegen';

jest.mock('@atlaskit/tokens/atlassian-light', () => {
	const actual = jest.requireActual('@atlaskit/tokens/atlassian-light');
	const fixtureNames = [
		'color.background.droptarget.pressed',
		'color.background.draghandle.hovered',
		'color.background.draghandle.pressed',
		'color.border.dropindicator.hovered',
		'color.border.dropindicator.pressed',
		'color.border.dropindicator.warning.hovered',
		'color.border.dropindicator.warning.pressed',
		'color.border.input.hovered',
		'color.border.input.pressed',
	];

	return {
		__esModule: true,
		default: [
			...actual.default,
			...fixtureNames.map((name) => ({
				name,
				cleanName: name,
				path: name.split('.'),
				value: '#CFE1FD',
				attributes: { group: 'paint', state: 'active' },
			})),
		],
	};
});

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
		expect(() => createColorStylesFromTemplate('fizzbuzz' as any)).toThrow();
	});

	test.each(['background', 'border'] as const)(
		'drag-and-drop families are excluded from %s pointer interaction styles',
		(property) => {
			const styles = createInteractionStylesFromTemplate(property);

			expect(styles).toContain(`token('color.${property}.input.hovered')`);
			expect(styles).toContain(`token('color.${property}.input.pressed')`);
			expect(styles).not.toMatch(/droptarget|dropindicator|draghandle/);
		},
	);
});
