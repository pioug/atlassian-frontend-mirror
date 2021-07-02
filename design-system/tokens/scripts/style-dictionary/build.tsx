/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';

import padStart from 'lodash/padStart';
import styleDictionary, { Config } from 'style-dictionary';

import palette from '../../src/tokens/palette';
import renameMapping from '../../src/tokens/rename-mapping';
import type { PaintToken, ShadowToken } from '../../src/types';

import formatterCSSVariables from './formatters/format-css-variables';
import formatterFigma from './formatters/format-figma';
import formatterTypeScriptTokenNames from './formatters/format-typescript-token-names';

const createConfig = (themeName: string): Config => ({
  parsers: [
    {
      pattern: /\.tsx$/,
      // Because we're using ESM we need to return the default property,
      // else we get "default" in our token paths.
      parse: ({ filePath }) => require(filePath).default,
    },
  ],
  format: {
    'css/custom-themed-variables': formatterCSSVariables as any,
    'typescript/custom-token-names': formatterTypeScriptTokenNames as any,
    'figma/custom-figma': formatterFigma as any,
  },
  transform: {
    'name/custom-dot': {
      type: 'name',
      transformer: (token) => {
        return token.path.join('.');
      },
    },
    'color/custom-palette': {
      type: 'value',
      matcher: (token) => {
        return !!token.attributes && !token.attributes.isPalette;
      },
      transformer: (token) => {
        const originalToken = token.original as PaintToken | ShadowToken;
        if (originalToken.attributes.group === 'paint') {
          const value = originalToken.value as PaintToken['value'];
          return palette.color.palette[value].value;
        }

        const values = originalToken.value as ShadowToken['value'];
        return values.map((value) => ({
          ...value,
          color: palette.color.palette[value.color].value,
        }));
      },
    },
    'box-shadow/custom-figma': {
      type: 'value',
      matcher: (token) => {
        return !!token.attributes && token.attributes.group === 'shadow';
      },
      transformer: (token) => {
        const shadowToken = token.original as ShadowToken;

        return shadowToken.value
          .splice(0)
          .reverse()
          .map((shadow) => {
            const opacityHex =
              // If opacity is 1 don't bother setting a hex.
              shadow.opacity === 1
                ? ''
                : padStart(
                    (shadow.opacity * 100).toString(16).toUpperCase(),
                    2,
                    '0',
                  );
            const paletteColor = palette.color.palette[shadow.color].value;
            const shadowColor = `${paletteColor}${opacityHex}`;
            const optionalSpread = shadow.spread ? ` ${shadow.spread}px` : '';

            return `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px${optionalSpread} ${shadowColor}`;
          })
          .join(', ');
      },
    },
  },
  source: [`./src/tokens/${themeName}/**/*.tsx`],
  include: ['./src/tokens/palette.tsx'],
  platforms: {
    figma: {
      transforms: ['name/custom-dot', 'color/custom-palette'],
      buildPath: `./dist/figma/${themeName}/`,
      options: {
        themeName,
        renameMapping,
      },
      files: [
        {
          format: 'figma/custom-figma',
          destination: 'sync-figma-tokens.js',
        },
      ],
    },
    ts: {
      transforms: ['name/custom-dot'],
      transformGroup: 'js',
      buildPath: `./src/tokens/`,
      files: [
        {
          format: 'typescript/custom-token-names',
          destination: 'token-names.tsx',
        },
      ],
    },
    css: {
      transforms: [
        'name/custom-dot',
        'color/custom-palette',
        'box-shadow/custom-figma',
      ],
      transformGroup: 'css',
      buildPath: `./css/`,
      options: {
        themeName,
      },
      files: [
        {
          format: 'css/custom-themed-variables',
          destination: `${themeName}.css`,
        },
      ],
    },
  },
});

const tokensInputDir = `${__dirname}/../../src/tokens`;

fs.readdirSync(tokensInputDir, { withFileTypes: true })
  .filter((result) => result.isDirectory())
  .forEach((theme) => {
    const config = createConfig(theme.name);
    const StyleDictionary = styleDictionary.extend(config);
    StyleDictionary.buildAllPlatforms();
  });
