/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';

import styleDictionary, { Config } from 'style-dictionary';

import { DEFAULT_THEME, LONG_SHORT_MAPPING } from './constants';
import formatterCSSVariables from './formatters/format-css-variables';
import formatterFigma from './formatters/format-figma';
import formatterRaw from './formatters/format-raw';
import formatterRenameMapper from './formatters/format-rename-mapper';
import formatterTSTokenDefaults from './formatters/format-typescript-token-defaults';
import formatterTSGeneratedTypes from './formatters/format-typescript-token-generated-types';
import formatterTSTokenNames from './formatters/format-typescript-token-names';
import boxShadowTransform from './transforms/box-shadow';
import paletteTransform from './transforms/palette';

const TOKENS_INPUT_DIR = './src/tokens/';
const TOKENS_OUTPUT_DIR = './src/artifacts/';

const createConfig = (themeName: string): Config => {
  // Optionally generate the default token mapping if the current theme
  // is the default one
  const typescriptFiles = [
    {
      format: 'typescript/custom-token-names',
      destination: 'token-names.tsx',
    },
    {
      format: 'typescript/custom-token-types',
      destination: 'types.tsx',
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
      'typescript/custom-token-names': formatterTSTokenNames as any,
      'typescript/custom-token-default-values': formatterTSTokenDefaults as any,
      'typescript/custom-token-types': formatterTSGeneratedTypes as any,
      'figma/custom-figma': formatterFigma as any,
      'rename-mapper': formatterRenameMapper as any,
      raw: formatterRaw as any,
    },
    transform: {
      'name/custom-dot': {
        type: 'name',
        transformer: (token) => token.path.join('.'),
      },
      'color/custom-palette': paletteTransform,
      'box-shadow/custom-figma': boxShadowTransform,
    },
    source: [path.join(TOKENS_INPUT_DIR, `${themeName}/**/*.tsx`)],
    include: [
      path.join(TOKENS_INPUT_DIR, 'palette.tsx'),
      path.join(TOKENS_INPUT_DIR, 'default/**/*.tsx'),
    ],
    platforms: {
      figma: {
        transforms: ['name/custom-dot', 'color/custom-palette'],
        buildPath: path.join(TOKENS_OUTPUT_DIR, `/figma/${themeName}/`),
        options: {
          themeName,
        },
        files: [
          {
            format: 'figma/custom-figma',
            destination: 'sync-figma-tokens.js',
          },
        ],
      },
      renameMapper: {
        transforms: ['name/custom-dot'],
        buildPath: TOKENS_OUTPUT_DIR,
        files: [
          {
            format: 'rename-mapper',
            destination: `rename-mapping.tsx`,
          },
        ],
      },
      raw: {
        transforms: ['name/custom-dot', 'color/custom-palette'],
        buildPath: path.join(TOKENS_OUTPUT_DIR, '/tokens-raw/'),
        options: {
          themeName,
        },
        files: [
          {
            format: 'raw',
            destination: `${themeName}.tsx`,
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
        buildPath: TOKENS_OUTPUT_DIR,
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
