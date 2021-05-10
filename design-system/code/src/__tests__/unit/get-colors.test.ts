import getTheme from '../../internal/theme/get-theme';

const ColorContrastChecker = require('color-contrast-checker');

describe('defaultColors', () => {
  describe('accessibility - WCAG AA', () => {
    const contrastCheck = new ColorContrastChecker();

    const lightTheme = getTheme({ mode: 'light' });
    const darkTheme = getTheme({ mode: 'dark' });
    const TEXT_SIZE = 12;

    Object.entries({ lightTheme, darkTheme }).forEach(
      ([themeType, themeColorsObj]) => {
        describe(`${themeType} color palette passes minimum contrast rule`, () => {
          const {
            lineNumberBgColor,
            lineNumberColor,
            backgroundColor,
            highlightedLineBgColor,
            highlightedLineBorderColor,
            fontFamilyItalic: _,
            fontFamily: __,
            ...foregroundColors
          } = themeColorsObj;

          it('line number colors are accessible', () => {
            const lineNumberContrastResult = contrastCheck.isLevelAA(
              lineNumberColor as string,
              lineNumberBgColor as string,
              TEXT_SIZE,
            );

            expect(lineNumberContrastResult).toBe(true);

            const lineNumberHighlightContrastResult = contrastCheck.isLevelAA(
              lineNumberColor as string,
              highlightedLineBgColor as string,
              TEXT_SIZE,
            );

            expect(lineNumberHighlightContrastResult).toBe(true);
          });

          it('highlight border color is accessible', () => {
            const lineNumberContrastResult = contrastCheck.isLevelCustom(
              highlightedLineBorderColor as string,
              highlightedLineBgColor as string,
              3.0, // UI elements only need a 3:1 ratio
            );

            expect(lineNumberContrastResult).toBe(true);
          });

          Object.values(foregroundColors).forEach((foregroundColor: string) => {
            // normal
            it(`${foregroundColor} foreground color is accessible with ${backgroundColor} background color`, () => {
              const foregroundColorContrastResult = contrastCheck.isLevelAA(
                foregroundColor,
                backgroundColor as string,
                TEXT_SIZE,
              );

              expect(foregroundColorContrastResult).toBe(true);
            });

            // highlighted
            it(`${foregroundColor} foreground color is accessible with ${highlightedLineBgColor} highlighted background color`, () => {
              const highlightedLineContrastResult = contrastCheck.isLevelAA(
                foregroundColor as string,
                highlightedLineBgColor as string,
                TEXT_SIZE,
              );

              expect(highlightedLineContrastResult).toBe(true);
            });
          });
        });
      },
    );
  });
});
