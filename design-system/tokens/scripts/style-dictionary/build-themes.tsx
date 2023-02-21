/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';

import { Config, Core } from 'style-dictionary';

import legacyPalette from '../../src/palettes/legacy-palette';
import defaultPalette from '../../src/palettes/palette';
import shapePalette from '../../src/palettes/shape-palette';
import spacingScale from '../../src/palettes/spacing-scale';
import typographyPalette from '../../src/palettes/typography-palette';
import themeConfig, { Palettes, ThemeFileNames } from '../../src/theme-config';

import {
  ARTIFACT_OUTPUT_DIR,
  FIGMA_ARTIFACT_OUTPUT_DIR,
  THEME_INPUT_DIR,
} from './constants';
import formatterCSSVariables from './formatters/css-variables';
import formatterCSSVariablesAsModule from './formatters/css-variables-as-module';
import formatterFigma from './formatters/figma';
import formatterRaw from './formatters/raw';
import boxShadowTransform from './transformers/box-shadow';
import dotSyntax from './transformers/dot-syntax';
import paletteTransform from './transformers/palette';

const getPalette = (paletteId: Palettes) => {
  switch (paletteId) {
    case 'spacingScale':
      return spacingScale;
    case 'typographyPalette':
      return typographyPalette;
    case 'legacyPalette':
      return legacyPalette;
    case 'shapePalette':
      return shapePalette;
    case 'defaultPalette':
    default:
      return defaultPalette;
  }
};

/**
 * Recursively find all base themes that the theme extends.
 */
const getBaseThemes = (themeName: ThemeFileNames): string[] => {
  let baseTheme;
  if (themeConfig[themeName].attributes.extends) {
    baseTheme = Object.entries(themeConfig).find(
      ([, { id }]) => id === themeConfig[themeName].attributes.extends,
    )?.[0];
  }

  const furtherExtensions = baseTheme
    ? getBaseThemes(baseTheme as ThemeFileNames)
    : [];

  return baseTheme ? [baseTheme, ...furtherExtensions] : [];
};

const createThemeConfig = (themeName: ThemeFileNames): Config => {
  // Get all base themes that this theme extends.
  const baseThemes = getBaseThemes(themeName);
  // Palette to be applied to the theme.
  const palette = getPalette(themeConfig[themeName].palette);

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
      'css/themed-variables': formatterCSSVariables as any,
      'css/themed-variables-as-module': formatterCSSVariablesAsModule as any,
      'figma/figma-sync': formatterFigma as any,
      raw: formatterRaw as any,
    },
    transform: {
      'name/dot': dotSyntax,
      'color/palette': paletteTransform(palette),
      'box-shadow/figma': boxShadowTransform(palette),
    },
    source: [path.join(THEME_INPUT_DIR, themeName, '**', '*.tsx')],
    include: [
      ...baseThemes.map((baseTheme) =>
        path.join(THEME_INPUT_DIR, baseTheme, '**', '*.tsx'),
      ),
      path.join(THEME_INPUT_DIR, 'default', '**', '*.tsx'),
    ],
    platforms: {
      figma: {
        transforms: ['name/dot', 'color/palette'],
        /**
         * Figma artifacts are output to a separate folder, because the
         * `@af/codegen` ESLint rule `@repo/internal/codegen/signed-source-integrity`
         * scans all directories called `artifacts` for signed source headers.
         */
        buildPath: FIGMA_ARTIFACT_OUTPUT_DIR,
        options: {
          themeName,
        },
        files: [
          {
            format: 'figma/figma-sync',
            destination: `${themeName}.json`,
          },
        ],
      },
      raw: {
        transforms: ['name/dot', 'color/palette'],
        buildPath: path.join(ARTIFACT_OUTPUT_DIR, 'tokens-raw/'),
        options: {
          themeName,
        },
        files: [
          {
            format: 'raw',
            destination: `${themeName}.tsx`,
            options: {
              cleanName: true,
            },
          },
        ],
      },
      cssAsModule: {
        transforms: ['name/dot', 'color/palette', 'box-shadow/figma'],
        buildPath: path.join(ARTIFACT_OUTPUT_DIR, 'themes/'),
        options: {
          themeName,
        },
        files: [
          {
            format: 'css/themed-variables-as-module',
            destination: `${themeName}.tsx`,
          },
        ],
      },
    },
  };
};

export default function build(styleDictionary: Core) {
  const tokensInputDir = `${__dirname}/../../src/tokens`;

  fs.readdirSync(tokensInputDir, { withFileTypes: true })
    .filter((result) => result.isDirectory() && result.name !== 'default')
    .forEach((theme) => {
      const config = createThemeConfig(theme.name as ThemeFileNames);
      styleDictionary.extend(config).buildAllPlatforms();
    });
}
