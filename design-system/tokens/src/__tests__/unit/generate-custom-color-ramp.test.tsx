import tokens from '../../artifacts/token-names';
import {
  generateColors,
  generateTokenMap,
  getClosestColorIndex,
} from '../../utils/generate-custom-color-ramp';

type Token = keyof typeof tokens;

const brandColor = '#65D26E';
const highContrastBrandColor = '#466D49';
const lowContrastBrandColor = '#B2CDB4';

describe('generateColors', () => {
  it('should generate a list of colors from a brand color', () => {
    const colors = generateColors(brandColor);
    const expectedColors = [
      '#ddffd7',
      '#90ff95',
      '#79e680',
      '#65D26E',
      '#4dba5a',
      '#30a043',
      '#05872d',
      '#007224',
      '#004c15',
      '#003c0f',
    ];
    expect(colors).toEqual(expectedColors);
  });
});

describe('generateTokenMap', () => {
  it('should generate symmetrical light and dark token maps', () => {
    const lightTokenMap = generateTokenMap(brandColor, 'light').light!;
    const darkTokenMap = generateTokenMap(brandColor, 'dark').dark!;

    expect(Object.entries(lightTokenMap).length).toEqual(25);
    expect(Object.entries(darkTokenMap).length).toEqual(25);

    Object.entries(lightTokenMap!).forEach(([tokenName, index]) => {
      const darkIndex = darkTokenMap![tokenName as Token] as number;
      expect(darkIndex + index).toEqual(9);
    });
  });

  it('should generate both light and dark token maps if mode is auto', () => {
    const lightTokenMap = generateTokenMap(brandColor, 'light').light;
    const darkTokenMap = generateTokenMap(brandColor, 'dark').dark;

    const lightAndDarkTokenMap = generateTokenMap(brandColor, 'auto');

    expect(lightAndDarkTokenMap.light).toEqual(lightTokenMap);
    expect(lightAndDarkTokenMap.dark).toEqual(darkTokenMap);
  });

  it('should use inputted brand color in brand tokens if the brand color has a high-contrast (>= 4.5)', () => {
    const colors = generateColors(highContrastBrandColor);
    const lightTokenMap = generateTokenMap(
      highContrastBrandColor,
      'light',
      colors,
    ).light!;

    const closestColorIndex = getClosestColorIndex(
      colors,
      highContrastBrandColor,
    );
    expect(lightTokenMap['color.background.selected.bold']).toEqual(
      closestColorIndex,
    );
    expect(lightTokenMap['color.background.brand.bold']).toEqual(
      closestColorIndex,
    );
    expect(lightTokenMap['color.text.selected']).toEqual(closestColorIndex);
    expect(lightTokenMap['color.text.brand']).toEqual(closestColorIndex);
  });

  it('should generate correct brand tokens from a low-contrast (< 4.5) brand color', () => {
    const lightTokenMap = generateTokenMap(lowContrastBrandColor, 'light')
      .light!;
    // the index 6 is hard-coded
    expect(lightTokenMap['color.background.selected.bold']).toEqual(6);
    expect(lightTokenMap['color.background.brand.bold']).toEqual(6);
    expect(lightTokenMap['color.text.selected']).toEqual(6);
    expect(lightTokenMap['color.text.brand']).toEqual(6);
  });

  it('should shift brand background token in dark mode if input brand color meets 4.5 contrast again inverse text color', () => {
    const tokenMap = generateTokenMap(brandColor, 'dark').dark!;
    expect(tokenMap['color.background.brand.bold']).toEqual(3);

    const lessSaturatedTokenMap = generateTokenMap(
      lowContrastBrandColor,
      'dark',
    ).dark!;
    const closestColorIndex = getClosestColorIndex(
      generateColors(lowContrastBrandColor),
      lowContrastBrandColor,
    );
    expect(lessSaturatedTokenMap['color.background.brand.bold']).toEqual(
      closestColorIndex,
    );
  });
});
