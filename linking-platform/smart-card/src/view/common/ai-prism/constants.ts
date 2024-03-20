import { AIThemeBorderPalette } from './types';

/**
 * The bulk of this file is originally from
 * https://bitbucket.org/atlassian/barrel/src/master/ui/platform/ui-kit/ai
 * with modifications.
 */

export const INNER_BORDER_RADIUS = 8;
export const OUTER_BORDER_RADIUS = 10;

// We don't yet have design system tokens representing the AI prism colour palette. We should replace this with
// equivalent tokens when available
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const aiThemeTokens = {
  blueUniqueGradientLight: '#00ACF8',
  blueUniqueGradientDark: '#008BD2',
  blue1000: '#092957',
  blue800: '#0055CC',
  blue700: '#0C66E4',
  blue600: '#1D7AFC',
  blue500: '#388BFF',
  blue300: '#85B8FF',
  blue200: '#CCE0FF',
  blue100: '#E9F2FF',
  teal500: '#37B4C3',
  teal300: '#8BDBE5',
  yellow500: '#CF9F02',
  yellow200: '#F8E6A0',
  red800: '#AE2A19',
  red600: '#E34935',
  orange500: '#F18D13',
  orange300: '#FEC57B',
};
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

export const AI_BORDER_PALETTE: AIThemeBorderPalette = {
  dark: {
    blue: aiThemeTokens.blue800,
    teal: aiThemeTokens.teal500,
    yellow: aiThemeTokens.yellow500,
  },
  light: {
    blue: aiThemeTokens.blue600,
    teal: aiThemeTokens.teal300,
    yellow: aiThemeTokens.yellow200,
  },
};
