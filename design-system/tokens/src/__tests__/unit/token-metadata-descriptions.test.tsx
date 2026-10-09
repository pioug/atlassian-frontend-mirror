import background from '../../../schema/tokens/color/background';
import border from '../../../schema/tokens/color/border';
import icon from '../../../schema/tokens/color/icon';
import text from '../../../schema/tokens/color/text';
import shape from '../../../schema/tokens/shape/shape';
import { tokens } from '../../entry-points/token-metadata.codegen';

const selectedBackground = background.color.background.selected;

const stateDescriptions = {
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

describe('selected and focused token metadata', () => {
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
