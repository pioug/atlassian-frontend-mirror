import tokens from '../../artifacts/token-names';
import { additionalContrastChecker } from '../../utils/custom-theme-token-contrast-check';
import {
  generateColors,
  generateTokenMap,
} from '../../utils/generate-custom-color-ramp';

type Token = keyof typeof tokens;
const brandColor = '#65D26E';

describe('additionalContrastChecker', () => {
  it('should darken tokens by one base token in light mode', () => {
    const originalTokenMap = generateTokenMap(brandColor, 'light').light!;
    const themeRamp = generateColors(brandColor);
    const newTokenMap = additionalContrastChecker({
      customThemeTokenMap: originalTokenMap,
      mode: 'light',
      themeRamp,
    });

    Object.entries(newTokenMap).forEach(([tokenName, index]) => {
      expect(index).toEqual(
        (originalTokenMap[tokenName as Token] as number) + 1,
      );
    });
  });
});
