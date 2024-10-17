import memoizeOne from 'memoize-one';

import * as colors from '@atlaskit/theme/colors';
import { getTokenValue, token } from '@atlaskit/tokens';

import type { CodeBlockTheme, CodeTheme } from './types';

// Hardcoded values have been used due to the current color palette not having any
// accessible color options for Teal and Yellow and +20A
const T800 = '#067384';
const Y1100 = '#7A5D1A';

export const getBaseTheme = (): CodeTheme => ({
	fontFamily: token('font.family.code'),
	fontFamilyItalic: `SFMono-MediumItalic, ${getTokenValue('font.family.code')}`,
	backgroundColor: token('color.background.neutral', colors.N20),
	textColor: token('color.text', colors.N800),
	lineNumberColor: token('color.text.subtlest', colors.N400),
	lineNumberBgColor: token('color.background.neutral', colors.N30),
});

export const getColorPalette = memoizeOne((): CodeBlockTheme => {
	return {
		highlightedLineBgColor: token('color.background.neutral', colors.N30),
		highlightedLineBorderColor: token('color.border.focused', colors.B200),
		substringColor: token('color.text.subtlest', colors.N400),
		keywordColor: token('color.text.accent.blue', colors.B400),
		attributeColor: token('color.text.accent.teal', T800),
		selectorTagColor: token('color.text.accent.blue', colors.B400),
		docTagColor: token('color.text.accent.yellow', Y1100),
		nameColor: token('color.text.accent.blue', colors.B400),
		builtInColor: token('color.text.accent.blue', colors.B400),
		literalColor: token('color.text.accent.blue', colors.B400),
		bulletColor: token('color.text.accent.blue', colors.B400),
		codeColor: token('color.text.accent.blue', colors.B400),
		regexpColor: token('color.text.accent.teal', T800),
		symbolColor: token('color.text.accent.teal', T800),
		variableColor: token('color.text.accent.teal', T800),
		templateVariableColor: token('color.text.accent.teal', T800),
		linkColor: token('color.text.accent.purple', colors.P300),
		selectorAttributeColor: token('color.text.accent.teal', T800),
		selectorPseudoColor: token('color.text.accent.teal', T800),
		typeColor: token('color.text.accent.teal', T800),
		stringColor: token('color.text.accent.green', colors.G500),
		selectorIdColor: token('color.text.accent.teal', T800),
		selectorClassColor: token('color.text.accent.teal', T800),
		quoteColor: token('color.text.accent.teal', T800),
		templateTagColor: token('color.text.accent.teal', T800),
		titleColor: token('color.text.accent.purple', colors.P300),
		sectionColor: token('color.text.accent.purple', colors.P300),
		commentColor: token('color.text.subtlest', colors.N400),
		metaKeywordColor: token('color.text.accent.green', colors.G500),
		metaColor: token('color.text.subtlest', colors.N400),
		functionColor: token('color.text', colors.N800),
		numberColor: token('color.text.accent.blue', colors.B400),
		prologColor: token('color.text.accent.blue', colors.B400),
		cdataColor: token('color.text.subtlest', colors.N400),
		punctuationColor: token('color.text', colors.N800),
		propertyColor: token('color.text.accent.purple', colors.P300),
		constantColor: token('color.text.accent.teal', T800),
		booleanColor: token('color.text.accent.blue', colors.B400),
		charColor: token('color.text', colors.N800),
		insertedColor: token('color.text.accent.green', colors.G500),
		deletedColor: token('color.text.accent.red', colors.R500),
		operatorColor: token('color.text', colors.N800),
		atruleColor: token('color.text.accent.green', colors.G500),
		importantColor: token('color.text.accent.yellow', Y1100),
	};
});

const getTheme = (): CodeBlockTheme => ({
	...getBaseTheme(),
	...getColorPalette(),
});

export default getTheme;
