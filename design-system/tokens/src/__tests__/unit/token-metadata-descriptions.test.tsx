import { dynamicColor } from '../../../schema/themes/UNSAFE-dynamic/_formulas';
import background from '../../../schema/tokens/color/background';
import border from '../../../schema/tokens/color/border';
import icon from '../../../schema/tokens/color/icon';
import text from '../../../schema/tokens/color/text';
import shape from '../../../schema/tokens/shape/shape';
import generatedPairs from '../../artifacts/generated-pairs';
import darkTokens from '../../artifacts/tokens-raw/atlassian-dark';
import increasedContrastDarkTokens from '../../artifacts/tokens-raw/atlassian-dark-increased-contrast';
import lightTokens from '../../artifacts/tokens-raw/atlassian-light';
import increasedContrastLightTokens from '../../artifacts/tokens-raw/atlassian-light-increased-contrast';
import dynamicLightTokens from '../../artifacts/tokens-raw/UNSAFE-dynamic';
import dynamicDarkTokens from '../../artifacts/tokens-raw/UNSAFE-dynamic-dark';
import testDarkTokens from '../../artifacts/tokens-raw/UNSAFE-test-dark';
import testLightTokens from '../../artifacts/tokens-raw/UNSAFE-test-light';
import { tokens } from '../../entry-points/token-metadata.codegen';

const selectedBackground = background.color.background.selected;

const stateDescriptions = {
	'color.border.dropindicator':
		border.color.border.dropindicator['[default]'].attributes.description,
	'color.border.dropindicator.warning':
		border.color.border.dropindicator.warning.attributes.description,
	'color.background.droptarget':
		background.color.background.droptarget['[default]'].attributes.description,
	'color.background.droptarget.hovered':
		background.color.background.droptarget.hovered.attributes.description,
	'color.background.draghandle': background.color.background.draghandle.attributes.description,
	'color.background.selected': selectedBackground['[default]']['[default]'].attributes.description,
	'color.background.selected.hovered':
		selectedBackground['[default]'].hovered.attributes.description,
	'color.background.selected.pressed':
		selectedBackground['[default]'].pressed.attributes.description,
	'color.background.selected.bold': selectedBackground.bold['[default]'].attributes.description,
	'color.background.selected.bold.hovered': selectedBackground.bold.hovered.attributes.description,
	'color.background.selected.bold.pressed': selectedBackground.bold.pressed.attributes.description,
	'color.blanket.selected': background.color.blanket.selected.attributes.description,
	'color.border.selected': border.color.border.selected.attributes.description,
	'color.border.focused': border.color.border.focused.attributes.description,
	'color.text.selected': text.color.text.selected.attributes.description,
	'color.icon.selected': icon.color.icon.selected.attributes.description,
	'border.width.selected': shape.border.width.selected.attributes.description,
	'border.width.focused': shape.border.width.focused.attributes.description,
};

describe('semantic token metadata', () => {
	it.each(Object.entries(stateDescriptions))(
		'publishes the canonical schema description for %s',
		(name, description) => {
			expect(description).toEqual(expect.any(String));
			expect(tokens.find((token) => token.name === name)?.description).toBe(description);
		},
	);

	it.each([
		'color.background.selected.bold',
		'color.background.selected.bold.hovered',
		'color.background.selected.bold.pressed',
	])('includes inverse foreground pairings in the standalone description for %s', (name) => {
		const description = tokens.find((token) => token.name === name)?.description;

		expect(description).toContain('color.text.inverse');
		expect(description).toContain('color.icon.inverse');
	});

	it.each([
		['color.text.selected', 'color.text.inverse'],
		['color.icon.selected', 'color.icon.inverse'],
	])(
		'includes the bold selected background exception in the description for %s',
		(name, inverse) => {
			expect(tokens.find((token) => token.name === name)?.description).toContain(
				`On bold selected backgrounds, use ${inverse} instead.`,
			);
		},
	);
});

describe('drag-and-drop theme output', () => {
	it.each(['color.background.droptarget', 'color.background.droptarget.hovered'])(
		'checks the accepting target outline against %s at 3:1',
		(background) => {
			expect(generatedPairs).toContainEqual(
				expect.objectContaining({
					foreground: 'color.border.dropindicator',
					background,
					desiredContrast: 3,
				}),
			);
		},
	);

	it('recommends inverse icons for filled drag handles', () => {
		expect(
			generatedPairs
				.filter((pair) => pair.background === 'color.background.draghandle')
				.map((pair) => pair.foreground),
		).toEqual(['color.icon.inverse']);
	});

	it.each([
		['color.border.dropindicator', 'Blue600', 'Blue500'],
		['color.border.dropindicator.warning', 'Orange600', 'Orange500'],
		['color.background.droptarget', 'Blue100', 'Blue1000'],
		['color.background.droptarget.hovered', 'Blue200', 'Blue900'],
		['color.background.draghandle', 'Blue700', 'Blue400'],
	])('generates the intended light and dark mappings for %s', (name, light, dark) => {
		expect(lightTokens.find((token) => token.cleanName === name)?.original.value).toBe(light);
		expect(darkTokens.find((token) => token.cleanName === name)?.original.value).toBe(dark);
	});

	it.each([
		['increased-contrast light', increasedContrastLightTokens, 'Blue100', 'Blue200'],
		['increased-contrast dark', increasedContrastDarkTokens, 'Blue1000', 'Blue900'],
		['test light', testLightTokens, 'Teal100', 'Teal200'],
		['test dark', testDarkTokens, 'Teal1000', 'Teal900'],
		[
			'dynamic light',
			dynamicLightTokens,
			dynamicColor.backgroundSubtle,
			dynamicColor.backgroundSubtleHovered,
		],
		[
			'dynamic dark',
			dynamicDarkTokens,
			dynamicColor.backgroundSubtle,
			dynamicColor.backgroundSubtleHovered,
		],
	] as const)(
		'preserves available and entered mappings in %s',
		(_theme, themeTokens, base, hovered) => {
			expect(
				themeTokens.find((token) => token.cleanName === 'color.background.droptarget')?.original
					.value,
			).toBe(base);
			expect(
				themeTokens.find((token) => token.cleanName === 'color.background.droptarget.hovered')
					?.original.value,
			).toBe(hovered);
		},
	);
});
