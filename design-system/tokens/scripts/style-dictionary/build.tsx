/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';

import styleDictionary, { Config } from 'style-dictionary';

import { DEFAULT_THEME, THEME_NAME_MAP } from '../../src/constants';
import defaultPalette from '../../src/palettes/palette';
import { ThemesLongName } from '../../src/types';

import formatterCSSVariables from './formatters/css-variables';
import formatterTokenDescriptionCSV from './formatters/csv-token-description';
import formatterFigma from './formatters/figma';
import formatterRaw from './formatters/raw';
import formatterRenameMapper from './formatters/rename-mapper';
import formatterTSTokenDefaults from './formatters/typescript-token-defaults';
import formatterTSGeneratedTypes from './formatters/typescript-token-generated-types';
import formatterTSGeneratedTypesInternal from './formatters/typescript-token-generated-types-internal';
import formatterTSTokenNames from './formatters/typescript-token-names';
import boxShadowTransform from './transformers/box-shadow';
import dotSyntax from './transformers/dot-syntax';
import paletteTransform from './transformers/palette';

const PALETTE_INPUT_DIR = './src/palettes/';
const THEME_INPUT_DIR = './src/tokens/';
const ARTIFACT_OUTPUT_DIR = './src/artifacts/';

const paletteConfig = {
  'atlassian-light': defaultPalette,
  'atlassian-dark': defaultPalette,
};

const createThemeConfig = (themeName: ThemesLongName): Config => {
  // Optionally generate the default token mapping if the current theme
  // is the default one
  const typescriptFiles = [
    {
      format: 'typescript/custom-token-names',
      destination: 'token-names.tsx',
    },
    {
      format: 'typescript/custom-token-types-internal',
      destination: 'types-internal.tsx',
    },
    {
      format: 'typescript/custom-token-types',
      destination: 'types.tsx',
    },
  ];

  if (THEME_NAME_MAP[themeName] === DEFAULT_THEME) {
    typescriptFiles.push({
      format: 'typescript/custom-token-default-values',
      destination: `token-default-values.tsx`,
    });
  }

  // Palette to be applied to the theme.
  const palette = paletteConfig[themeName];

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
      'csv/token-descriptions': formatterTokenDescriptionCSV as any,
      'typescript/custom-token-names': formatterTSTokenNames as any,
      'typescript/custom-token-default-values': formatterTSTokenDefaults as any,
      'typescript/custom-token-types': formatterTSGeneratedTypes as any,
      'typescript/custom-token-types-internal': formatterTSGeneratedTypesInternal as any,
      'figma/custom-figma': formatterFigma as any,
      'rename-mapper': formatterRenameMapper as any,
      raw: formatterRaw as any,
    },
    transform: {
      'name/custom-dot': dotSyntax,
      'color/custom-palette': paletteTransform(palette),
      'box-shadow/custom-figma': boxShadowTransform,
    },
    source: [path.join(THEME_INPUT_DIR, `${themeName}/**/*.tsx`)],
    include: [
      // path.join(TOKENS_INPUT_DIR, 'palette.tsx'),
      // path.join(TOKENS_INPUT_DIR, 'legacy-palette.tsx'),
      path.join(THEME_INPUT_DIR, 'default/**/*.tsx'),
    ],
    platforms: {
      figma: {
        transforms: ['name/custom-dot', 'color/custom-palette'],
        buildPath: path.join(ARTIFACT_OUTPUT_DIR, `/figma/${themeName}/`),
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
        buildPath: ARTIFACT_OUTPUT_DIR,
        files: [
          {
            format: 'rename-mapper',
            destination: `rename-mapping.tsx`,
          },
        ],
      },
      raw: {
        transforms: ['name/custom-dot', 'color/custom-palette'],
        buildPath: path.join(ARTIFACT_OUTPUT_DIR, '/tokens-raw/'),
        options: {
          themeName,
          groups: ['paint', 'shadow', 'raw'],
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
        buildPath: ARTIFACT_OUTPUT_DIR,
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
      csv: {
        transforms: ['name/custom-dot', 'color/custom-palette'],
        buildPath: ARTIFACT_OUTPUT_DIR,
        options: {
          groups: ['paint', 'shadow', 'raw'],
        },
        files: [
          {
            format: 'csv/token-descriptions',
            destination: 'token-descriptions.csv',
          },
        ],
      },
    },
  };
};

const createPaletteConfig = (paletteFileName: string): Config => ({
  source: [path.join(PALETTE_INPUT_DIR, paletteFileName)],
  parsers: [
    {
      pattern: /\.tsx$/,
      // Because we're using ESM we need to return the default property,
      // else we get "default" in our token paths.
      parse: ({ filePath }) => require(filePath).default,
    },
  ],
  transform: {
    'name/custom-dot': dotSyntax,
  },
  format: {
    raw: formatterRaw as any,
  },
  platforms: {
    rawPalette: {
      transforms: ['name/custom-dot'],
      buildPath: ARTIFACT_OUTPUT_DIR,
      options: {
        groups: ['palette'],
      },
      files: [
        {
          format: 'raw',
          destination: path.join(`palettes-raw`, paletteFileName),
        },
      ],
    },
  },
});

/**
 * Generates all necessary palette artifacts
 */
const paletteInputDir = `${__dirname}/../../src/palettes`;

fs.readdirSync(paletteInputDir, { withFileTypes: true })
  .filter((result) => !result.isDirectory())
  .forEach((palette) => {
    const config = createPaletteConfig(palette.name);
    const StyleDictionary = styleDictionary.extend(config);
    StyleDictionary.buildAllPlatforms();
  });

/**
 * Generates all necessary theme artifacts
 */
const tokensInputDir = `${__dirname}/../../src/tokens`;

fs.readdirSync(tokensInputDir, { withFileTypes: true })
  .filter((result) => result.isDirectory() && result.name !== 'default')
  .forEach((theme) => {
    const config = createThemeConfig(theme.name as ThemesLongName);
    const StyleDictionary = styleDictionary.extend(config);
    StyleDictionary.buildAllPlatforms();
  });
