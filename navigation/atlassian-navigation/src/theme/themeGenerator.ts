import defaultTheme, { DEFAULT_THEME_NAME } from './defaultTheme';
import {
  generateTextColor,
  getBoxShadow,
  getContrastColor,
  hexToRGBA,
} from './themeHelpers';
import { ButtonCSSContext, GenerateThemeArgs, NavigationTheme } from './types';

type Colors = {
  backgroundColor: string;
  color: string;
  highlightColor: string;
};

const generateOpacityValue = (color: string) =>
  color === '#000000' ? 0.3 : 0.6;

type ButtonType = 'create' | 'iconButton' | 'primaryButton' | 'productHome';
const generateButtonCSSStates = (
  colors: Colors,
  buttonType: ButtonType,
): ButtonCSSContext => {
  const { backgroundColor, color, highlightColor } = colors;

  // Add less opacity for white text so it is still legible.
  const opacityValue = generateOpacityValue(color);
  const isCreateButton = buttonType === 'create';

  return {
    active: {
      backgroundColor: isCreateButton
        ? hexToRGBA(backgroundColor, 0.65)
        : getContrastColor(0.3, opacityValue, backgroundColor),
      boxShadow: getBoxShadow('transparent'),
      color,
    },
    default: {
      backgroundColor,
      boxShadow: getBoxShadow('transparent'),
      color,
    },
    focus: {
      boxShadow: getBoxShadow(hexToRGBA(highlightColor, 0.5)),
      color,
      backgroundColor,
    },
    hover: {
      backgroundColor: isCreateButton
        ? hexToRGBA(backgroundColor, 0.8)
        : getContrastColor(0.1, opacityValue, backgroundColor),
      boxShadow: getBoxShadow('transparent'),
      color,
    },
    selected: {
      color,
      backgroundColor,
      borderColor: highlightColor,
      boxShadow: getBoxShadow('transparent'),
    },
  };
};

const generateCreateButtonColors = (
  themeBackground: string,
  themeHighlight: string,
) => ({
  backgroundColor: themeHighlight,
  color: generateTextColor(themeHighlight),
  highlightColor: themeHighlight,
});

export const generateTheme = (
  themeColors: GenerateThemeArgs,
): NavigationTheme => {
  const { backgroundColor, highlightColor, name } = themeColors;
  const color = generateTextColor(backgroundColor);
  const colors = { ...themeColors, color };

  if (name === DEFAULT_THEME_NAME) {
    return defaultTheme;
  }

  return {
    mode: {
      create: generateButtonCSSStates(
        generateCreateButtonColors(backgroundColor, highlightColor),
        'create',
      ),
      iconButton: generateButtonCSSStates(colors, 'iconButton'),
      primaryButton: generateButtonCSSStates(colors, 'primaryButton'),
      navigation: {
        backgroundColor,
        color,
      },
      productHome: {
        color,
        backgroundColor: highlightColor,
        borderRight: `1px solid ${hexToRGBA(color, 0.5)}`,
      },
      search: {
        default: {
          backgroundColor,
          color,
          borderColor: hexToRGBA(color, 0.5),
        },
        focus: {
          borderColor: hexToRGBA(highlightColor, 0.8),
        },
        hover: {
          backgroundColor: getContrastColor(
            0.1,
            generateOpacityValue(color),
            backgroundColor,
          ),
          color,
        },
      },
      skeleton: { backgroundColor: color, opacity: 0.08 },
    },
  };
};

export default generateTheme;
