import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const ColorContrastChecker = require('color-contrast-checker');
// Hardcoded values have been used due to the current color palette not having any
// accessible color options for Teal and Yellow and +20A
const T800 = '#067384';
const Y1100 = '#7A5D1A';

describe('defaultColors', () => {
	describe('accessibility - WCAG AA', () => {
		const contrastCheck = new ColorContrastChecker();

		const TEXT_SIZE = 12;

		function extraColorCode(colorString: string | undefined) {
			if (!colorString) {
				return '';
			}
			let colorRegx = /#(?:[0-9a-fA-F]{3}){1,2}/g;
			let matchColors = colorString.match(colorRegx);
			return matchColors ? matchColors[0] : colorString;
		}

		describe('color palette passes minimum contrast rule', () => {
			const baseTheme = {
				lineNumberBgColor: token('color.background.neutral', colors.N30),
				lineNumberColor: token('color.text.subtlest', colors.N400),
				backgroundColor: token('color.background.neutral', colors.N20),
				highlightedLineBgColor: token('color.background.neutral', colors.N30),
				highlightedLineBorderColor: token('color.border.focused', colors.B200),
				fontFamily: token('font.family.code'),
			};
			const foregroundColors = {
				textColor: token('color.text', colors.N800),
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

			//extract color code
			let lineNumberBgColorCode = extraColorCode(baseTheme.lineNumberBgColor);
			let lineNumberColorCode = extraColorCode(baseTheme.lineNumberColor);
			let backgroundColorCode = extraColorCode(baseTheme.backgroundColor);
			let highlightedLineBgColorCode = extraColorCode(baseTheme.highlightedLineBgColor);
			let highlightedLineBorderColorCode = extraColorCode(baseTheme.highlightedLineBorderColor);

			it('line number colors are accessible', () => {
				const lineNumberContrastResult = contrastCheck.isLevelAA(
					lineNumberColorCode as string,
					lineNumberBgColorCode as string,
					TEXT_SIZE,
				);

				expect(lineNumberContrastResult).toBe(true);

				const lineNumberHighlightContrastResult = contrastCheck.isLevelAA(
					lineNumberColorCode as string,
					highlightedLineBgColorCode as string,
					TEXT_SIZE,
				);

				expect(lineNumberHighlightContrastResult).toBe(true);
			});

			it('highlight border color is accessible', () => {
				const lineNumberContrastResult = contrastCheck.isLevelCustom(
					highlightedLineBorderColorCode as string,
					highlightedLineBgColorCode as string,
					3.0, // UI elements only need a 3:1 ratio
				);

				expect(lineNumberContrastResult).toBe(true);
			});

			Object.values(foregroundColors).forEach((foregroundColor) => {
				// extra color code only
				const color = extraColorCode(String(foregroundColor));
				// normal
				it(`${color} foreground color is accessible with ${backgroundColorCode} background color`, () => {
					const foregroundColorContrastResult = contrastCheck.isLevelAA(
						color,
						backgroundColorCode as string,
						TEXT_SIZE,
					);

					expect(foregroundColorContrastResult).toBe(true);
				});

				// highlighted
				it(`${color} foreground color is accessible with ${highlightedLineBgColorCode} highlighted background color`, () => {
					const highlightedLineContrastResult = contrastCheck.isLevelAA(
						color as string,
						highlightedLineBgColorCode as string,
						TEXT_SIZE,
					);

					expect(highlightedLineContrastResult).toBe(true);
				});
			});
		});
	});
});
