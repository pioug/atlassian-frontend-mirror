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
import formatterTSTokenValueForContrastCheck from './formatters/typescript-token-value-for-contrast-check';
import boxShadowTransform from './transformers/box-shadow';
import dotSyntax from './transformers/dot-syntax';
import numberPixelTransform from './transformers/number-pixel';
import paletteTransform from './transformers/palette';
import pixelRemTransform from './transformers/pixel-rem';

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

const createThemeConfig = (
  themeName: ThemeFileNames,
  baseThemes: string[],
  palette: ReturnType<typeof getPalette>,
): Config => {
  const config: Config = {
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
      'typescript/generate-token-value-for-contrast-check':
        formatterTSTokenValueForContrastCheck as any,
    },
    transform: {
      'name/dot': dotSyntax,
      'color/palette': paletteTransform(palette),
      'box-shadow/figma': boxShadowTransform(palette),
      'pixel/rem': pixelRemTransform,
      'raw/pixel': numberPixelTransform,
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
         * `@atlassian/codegen` ESLint rule `@repo/internal/codegen/signed-source-integrity`
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
        transforms: ['name/dot', 'color/palette', 'raw/pixel'],
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
        transforms: [
          'name/dot',
          'color/palette',
          'pixel/rem',
          'box-shadow/figma',
        ],
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

  if (themeName === 'atlassian-light' || themeName === 'atlassian-dark') {
    config.platforms.ts = {
      transforms: [
        'name/dot',
        'color/palette',
        'pixel/rem',
        'box-shadow/figma',
      ],
      buildPath: ARTIFACT_OUTPUT_DIR,
      files: [
        {
          format: 'typescript/generate-token-value-for-contrast-check',
          destination: `${themeName}-token-value-for-contrast-check.tsx`,
        },
      ],
    };
  }

  return config;
};

export default function build(styleDictionary: Core) {
  const tokensInputDir = `${__dirname}/../../src/tokens`;

  fs.readdirSync(tokensInputDir, { withFileTypes: true })
    .filter((result) => result.isDirectory() && result.name !== 'default')
    .forEach((theme) => {
      const themeName = theme.name as ThemeFileNames;
      const baseThemes = getBaseThemes(themeName);
      const palette = getPalette(themeConfig[themeName].palette);
      const config = createThemeConfig(themeName, baseThemes, palette);
      styleDictionary.extend(config).buildAllPlatforms();
    });
}
