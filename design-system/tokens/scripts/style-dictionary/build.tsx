/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';

import styleDictionary, { Config } from 'style-dictionary';

import renameMapping from '../../src/tokens/rename-mapping';

import { DEFAULT_THEME, LONG_SHORT_MAPPING } from './constants';
import formatterCSSVariables from './formatters/format-css-variables';
import formatterFigma from './formatters/format-figma';
import formatterTypeScriptTokenDefaults from './formatters/format-typescript-token-defaults';
import formatterTypeScriptTokenNames from './formatters/format-typescript-token-names';
import boxShadowTransform from './transforms/box-shadow';
import paletteTransform from './transforms/palette';

const createConfig = (themeName: string): Config => {
  // We need to optionally generate the default token mapping if the current theme
  // is the default one.
  const typescriptFiles = [
    {
      format: 'typescript/custom-token-names',
      destination: 'token-names.tsx',
    },
  ];
  if (LONG_SHORT_MAPPING[themeName] === DEFAULT_THEME) {
    typescriptFiles.push({
      format: 'typescript/custom-token-default-values',
      destination: `token-default-values.tsx`,
    });
  }

  return {
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
      'typescript/custom-token-default-values': formatterTypeScriptTokenDefaults as any,
      'figma/custom-figma': formatterFigma as any,
    },
    transform: {
      'name/custom-dot': {
        type: 'name',
        transformer: (token) => token.path.join('.'),
      },
      'color/custom-palette': paletteTransform,
      'box-shadow/custom-figma': boxShadowTransform,
    },
    source: [`./src/tokens/${themeName}/**/*.tsx`],
    include: ['./src/tokens/palette.tsx', './src/tokens/default/**/*.tsx'],
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
        transforms: [
          'name/custom-dot',
          'color/custom-palette',
          'box-shadow/custom-figma',
        ],
        transformGroup: 'js',
        buildPath: `./src/tokens/`,
        files: typescriptFiles,
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
  };
};

const tokensInputDir = `${__dirname}/../../src/tokens`;

fs.readdirSync(tokensInputDir, { withFileTypes: true })
  .filter((result) => result.isDirectory() && result.name !== 'default')
  .forEach((theme) => {
    const config = createConfig(theme.name);
    const StyleDictionary = styleDictionary.extend(config);
    StyleDictionary.buildAllPlatforms();
  });
