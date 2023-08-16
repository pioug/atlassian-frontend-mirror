import tokenValuesDark from '../artifacts/atlassian-dark-token-value-for-contrast-check';
import tokenValuesLight from '../artifacts/atlassian-light-token-value-for-contrast-check';
import tokens from '../artifacts/token-names';

import { getContrastRatio } from './color-utils';

type Token = keyof typeof tokens;
interface AdditionalContrastCheck {
  foreground: Token;
  backgroundLight: Token;
  backgroundDark: Token;
  desiredContrast: number;
  updatedTokens: Token[];
}

export const additionalChecks: AdditionalContrastCheck[] = [
  {
    foreground: 'color.text.brand',
    backgroundLight: 'elevation.surface.sunken',
    backgroundDark: 'elevation.surface.overlay',
    desiredContrast: 4.5,
    updatedTokens: [
      // In light mode: darken the following tokens by one base token
      // In dark mode: lighten the following tokens by one base token
      'color.text.brand',
      'color.text.selected',
      'color.link',
      'color.link.pressed',
      'color.icon.brand',
      'color.icon.selected',
    ],
  },
  {
    foreground: 'color.text.brand',
    backgroundLight: 'color.background.selected',
    backgroundDark: 'color.background.selected',
    desiredContrast: 4.5,
    // In light mode: darken the following tokens by one base token
    // In dark mode: lighten the following tokens by one base toke
    updatedTokens: ['color.text.brand', 'color.link', 'color.link.pressed'],
  },
  {
    foreground: 'color.text.selected',
    backgroundLight: 'color.background.selected',
    backgroundDark: 'color.background.selected',
    desiredContrast: 4.5,
    // In light mode: darken the following tokens by one base token
    // In dark mode: lighten the following tokens by one base token
    updatedTokens: ['color.text.selected', 'color.icon.selected'],
  },
  {
    foreground: 'color.border.brand',
    backgroundLight: 'elevation.surface.sunken',
    backgroundDark: 'elevation.surface.overlay',
    desiredContrast: 3,
    // In light mode: darken the following tokens by one base token
    // In dark mode: lighten the following tokens by one base toke
    updatedTokens: ['color.border.brand', 'color.border.selected'],
  },

  {
    foreground: 'color.chart.brand',
    backgroundLight: 'elevation.surface.sunken',
    backgroundDark: 'elevation.surface.overlay',
    desiredContrast: 3,
    // In light mode: darken the following tokens by one base token
    // In dark mode: lighten the following tokens by one base token
    updatedTokens: ['color.chart.brand', 'color.chart.brand.hovered'],
  },
];

const getColorFromTokenRaw = (
  tokenName: string,
  mode: 'light' | 'dark',
): string => {
  return (
    mode === 'light'
      ? tokenValuesLight[tokenName as keyof typeof tokenValuesLight]
      : tokenValuesDark[tokenName as keyof typeof tokenValuesDark]
  ) as string;
};

export const additionalContrastChecker = ({
  customThemeTokenMap,
  mode,
  themeRamp,
}: {
  customThemeTokenMap: { [key: string]: number | string };
  mode: 'light' | 'dark';
  themeRamp: string[];
}): { [key: string]: number } => {
  const updatedCustomThemeTokenMap: { [key: string]: number } = {};

  const brandTokens = Object.keys(customThemeTokenMap);
  additionalChecks.forEach((pairing) => {
    const {
      backgroundLight,
      backgroundDark,
      foreground,
      desiredContrast,
      updatedTokens,
    } = pairing;
    const background = mode === 'light' ? backgroundLight : backgroundDark;

    const foregroundTokenValue = customThemeTokenMap[foreground];
    const backgroundTokenValue = customThemeTokenMap[background];

    const foregroundColor = brandTokens.includes(foreground)
      ? typeof foregroundTokenValue === 'string'
        ? foregroundTokenValue
        : themeRamp[foregroundTokenValue]
      : getColorFromTokenRaw(foreground, mode);
    const backgroundColor = brandTokens.includes(background)
      ? typeof backgroundTokenValue === 'string'
        ? backgroundTokenValue
        : themeRamp[backgroundTokenValue]
      : getColorFromTokenRaw(background, mode);
    const contrast = getContrastRatio(
      foregroundColor as string,
      backgroundColor as string,
    );
    if (contrast <= desiredContrast) {
      updatedTokens.forEach((token: Token) => {
        const rampValue = customThemeTokenMap[token];
        if (typeof rampValue === 'number') {
          updatedCustomThemeTokenMap[token] =
            mode === 'light' ? rampValue + 1 : rampValue - 1;
        }
      });
    }
  });
  return updatedCustomThemeTokenMap;
};
