import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import {
  COLOR_MODE_ATTRIBUTE,
  CONTRAST_MODE_ATTRIBUTE,
  THEME_DATA_ATTRIBUTE,
} from '../../../src/constants';
import themeConfig, { Themes } from '../../../src/theme-config';
import { TypographyDesignToken } from '../../../src/types';
import getIncreasedContrastTheme from '../../../src/utils/get-increased-contrast-theme';
import { getCSSCustomProperty } from '../../../src/utils/token-ids';
import sortTokens from '../sort-tokens';
import { fontTokenToCSS } from '../transformers/web-font';
import { getValue, themeNameToId } from '../utilities';

export const cssVariableFormatter: Format['formatter'] = ({
  dictionary,
  options,
}) => {
  if (!options.themeName) {
    throw new Error('options.themeName required');
  }

  const theme = themeConfig[options.themeName as Themes];
  const colorModes = ['light', 'dark'] as const;

  if (!theme.id) {
    throw new Error(
      `Theme Id should include in one of the following Ids: [${Object.values(
        themeConfig,
      )
        .map(({ id }) => id)
        .join(', ')}]`,
    );
  }

  const tokens = sortTokens(
    dictionary.allTokens.filter(
      (token) => token.attributes && token.attributes.group !== 'palette',
    ),
  ).map((token) => {
    const tokenName = getCSSCustomProperty(token.path);

    if (token.attributes?.group === 'typography') {
      token.value = fontTokenToCSS(token);
    }

    return { ...token, name: tokenName };
  });

  let output = '';
  let indent = 0;

  function outputLine(line: string) {
    output += `${' '.repeat(indent)}${line}\n`;
  }

  let themeId = theme.override || theme.id;

  if (theme.attributes.type === 'color') {
    let selectors: string[] = colorModes.map(
      (mode) =>
        `html[${COLOR_MODE_ATTRIBUTE}="${mode}"][${THEME_DATA_ATTRIBUTE}~="${mode}:${themeId}"]`,
    );

    const hasIncreasedContrastTheme = Boolean(
      getIncreasedContrastTheme(themeId),
    );
    const targetIncreasedContrastTheme = options.increasedContrastTarget
      ? themeNameToId(options.increasedContrastTarget)
      : undefined;

    if (hasIncreasedContrastTheme) {
      // TODO: This is not enabled yet as it's not needed due to specificity,
      // but we should consider adding this in future.
      //
      // If this is a standard theme that has an increased contrast theme,
      // append selectors with `prefers-contrast: no-preference` so they aren't
      // matched when inactive.
      // selectors = selectors.map(
      //   (selector) => `${selector}[${CONTRAST_MODE_ATTRIBUTE}="no-preference"]`,
      // );
    } else if (targetIncreasedContrastTheme) {
      // If this theme IS an increased contrast theme, add additional selectors targeting the
      // standard theme combined with `prefers-contrast: more`.
      selectors = [
        ...selectors,
        ...colorModes.map(
          (mode) =>
            `html[${COLOR_MODE_ATTRIBUTE}="${mode}"][${CONTRAST_MODE_ATTRIBUTE}="more"][${THEME_DATA_ATTRIBUTE}~="${mode}:${targetIncreasedContrastTheme}"]`,
        ),
      ];
    }

    outputLine(`${selectors.join(',\n')} {`);
    indent += 2;
    outputLine(`color-scheme: ${theme.attributes.mode};`);
  } else {
    outputLine(
      `html[${THEME_DATA_ATTRIBUTE}~="${theme.attributes.type}:${themeId}"] {`,
    );
    indent += 2;
  }

  // For typography we want to write some tokens twice under different breakpoints
  // We only really care about the new minor3 scale for responsive tokens.
  // TODO: Once ADG3 tokenset is no longer used we can remove those tokens and this check. Minor third should be the only scale remaining.
  if (
    theme.attributes.type === 'typography' &&
    themeId === 'typography-minor3'
  ) {
    tokens.forEach((token) => {
      const tokenValue = getValue(dictionary, token);

      outputLine(`${token.name}: ${tokenValue};`);
    });

    // Define breakpoint as below md.
    // This is defined in @atlaskit/primitives however adding would cause a circular dependency
    const mediaQuery = '@media not all and (min-width: 64rem)';
    outputLine(`${mediaQuery} {`);
    indent += 2;

    // Find all the tokens that specify a responsive counterpart,
    // then find and write each counterpart to the output
    tokens
      .filter(
        (token) =>
          (token.attributes as TypographyDesignToken<any>['attributes'])
            .responsiveSmallerVariant !== undefined,
      )
      .forEach((token) => {
        const tokenPath = (
          token.attributes as TypographyDesignToken<any>['attributes']
        ).responsiveSmallerVariant;
        const responsiveToken = tokens.find(
          (token) => token.path.join('.') === tokenPath,
        );

        if (responsiveToken) {
          const tokenValue = getValue(dictionary, responsiveToken);
          outputLine(`${token.name}: ${tokenValue};`);
        }
      });

    indent -= 2;
    outputLine(`}`);
  } else {
    tokens.forEach((token) => {
      const tokenValue = getValue(dictionary, token);

      outputLine(`${token.name}: ${tokenValue};`);
    });
  }

  indent -= 2;
  outputLine('}');

  return output;
};

const fileFormatter: Format['formatter'] = (args) =>
  createSignedArtifact(cssVariableFormatter(args), `yarn build tokens`);

export default fileFormatter;
