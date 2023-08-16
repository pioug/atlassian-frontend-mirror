import tokens from '../artifacts/token-names';
import { CUSTOM_THEME_ATTRIBUTE, THEME_DATA_ATTRIBUTE } from '../constants';
import { ThemeColorModes, ThemeOptionsSchema } from '../theme-config';

import { hash } from './hash';

type Token = keyof typeof tokens;
type ThemeAttributeId = 'light' | 'dark';

export function findMissingCustomStyleElements(
  UNSAFE_themeOptions: ThemeOptionsSchema,
  mode: ThemeColorModes,
): ThemeAttributeId[] {
  const optionString = JSON.stringify(UNSAFE_themeOptions);
  const uniqueId = hash(optionString);

  const attrOfMissingCustomStyles: ThemeAttributeId[] = [];
  (mode === 'auto' ? ['light', 'dark'] : [mode]).forEach((themeId) => {
    const element = document.head.querySelector(
      `style[${CUSTOM_THEME_ATTRIBUTE}="${uniqueId}"][${THEME_DATA_ATTRIBUTE}="${themeId}"]`,
    );
    if (element) {
      // Append the existing custom styles to take precedence over others
      document.head.appendChild(element);
    } else {
      attrOfMissingCustomStyles.push(themeId as ThemeAttributeId);
    }
  });

  return attrOfMissingCustomStyles;
}

export function limitSizeOfCustomStyleElements(sizeThreshold: number): void {
  const styleTags = [
    ...document.head.querySelectorAll(
      `style[${CUSTOM_THEME_ATTRIBUTE}][${THEME_DATA_ATTRIBUTE}]`,
    ),
  ];

  if (styleTags.length < sizeThreshold) {
    return;
  }

  styleTags
    .slice(0, styleTags.length - (sizeThreshold - 1))
    .forEach((element) => element.remove());
}

export function reduceTokenMap(
  tokenMap: { [key in Token]?: number | string },
  themeRamp: string[],
): string {
  return Object.entries(tokenMap).reduce<string>(
    (acc: string, [key, value]) => {
      const cssVar = tokens[key as Token];
      return cssVar
        ? `${acc}\n  ${cssVar}: ${
            typeof value === 'string' ? value : themeRamp[value]
          };`
        : acc;
    },
    '',
  );
}
