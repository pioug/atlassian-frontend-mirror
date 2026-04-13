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
				lineNumberBgColor: token('color.background.neutral', '#EBECF0'),
				lineNumberColor: token('color.text.subtlest', '#505F79'),
				backgroundColor: token('color.background.neutral', '#F4F5F7'),
				highlightedLineBgColor: token('color.background.neutral', '#EBECF0'),
				highlightedLineBorderColor: token('color.border.focused', '#2684FF'),
				fontFamily: token('font.family.code'),
			};
			const foregroundColors = {
				textColor: token('color.text', '#172B4D'),
				substringColor: token('color.text.subtlest', '#505F79'),
				keywordColor: token('color.text.accent.blue', '#0052CC'),
				attributeColor: token('color.text.accent.teal', T800),
				selectorTagColor: token('color.text.accent.blue', '#0052CC'),
				docTagColor: token('color.text.accent.yellow', Y1100),
				nameColor: token('color.text.accent.blue', '#0052CC'),
				builtInColor: token('color.text.accent.blue', '#0052CC'),
				literalColor: token('color.text.accent.blue', '#0052CC'),
				bulletColor: token('color.text.accent.blue', '#0052CC'),
				codeColor: token('color.text.accent.blue', '#0052CC'),
				regexpColor: token('color.text.accent.teal', T800),
				symbolColor: token('color.text.accent.teal', T800),
				variableColor: token('color.text.accent.teal', T800),
				templateVariableColor: token('color.text.accent.teal', T800),
				linkColor: token('color.text.accent.purple', '#6554C0'),
				selectorAttributeColor: token('color.text.accent.teal', T800),
				selectorPseudoColor: token('color.text.accent.teal', T800),
				typeColor: token('color.text.accent.teal', T800),
				stringColor: token('color.text.accent.green', '#006644'),
				selectorIdColor: token('color.text.accent.teal', T800),
				selectorClassColor: token('color.text.accent.teal', T800),
				quoteColor: token('color.text.accent.teal', T800),
				templateTagColor: token('color.text.accent.teal', T800),
				titleColor: token('color.text.accent.purple', '#6554C0'),
				sectionColor: token('color.text.accent.purple', '#6554C0'),
				commentColor: token('color.text.subtlest', '#505F79'),
				metaKeywordColor: token('color.text.accent.green', '#006644'),
				metaColor: token('color.text.subtlest', '#505F79'),
				functionColor: token('color.text', '#172B4D'),
				numberColor: token('color.text.accent.blue', '#0052CC'),
				prologColor: token('color.text.accent.blue', '#0052CC'),
				cdataColor: token('color.text.subtlest', '#505F79'),
				punctuationColor: token('color.text', '#172B4D'),
				propertyColor: token('color.text.accent.purple', '#6554C0'),
				constantColor: token('color.text.accent.teal', T800),
				booleanColor: token('color.text.accent.blue', '#0052CC'),
				charColor: token('color.text', '#172B4D'),
				insertedColor: token('color.text.accent.green', '#006644'),
				deletedColor: token('color.text.accent.red', '#BF2600'),
				operatorColor: token('color.text', '#172B4D'),
				atruleColor: token('color.text.accent.green', '#006644'),
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
