import path from 'path';

import { Config, Core } from 'style-dictionary';

import defaultPalette from '../../src/palettes/palette';
import shapePalette from '../../src/palettes/shape-palette';
import spacingScale from '../../src/palettes/spacing-scale';
import typographyPalette from '../../src/palettes/typography-palette';

import { ARTIFACT_OUTPUT_DIR, THEME_INPUT_DIR } from './constants';
import formatterTokenDescriptionCSV from './formatters/csv-token-description';
import formatterDynamicImportMap from './formatters/dynamic-import-map';
import formatterReplacementMapper from './formatters/replacement-mapper';
import formatterTSTokenDefaults from './formatters/typescript-token-defaults';
import formatterTSGeneratedTypes from './formatters/typescript-token-generated-types';
import formatterTSGeneratedTypesInternal from './formatters/typescript-token-generated-types-internal';
import formatterTSTokenNames from './formatters/typescript-token-names';
import formatterTSGeneratedPairings from './formatters/typescript-token-pairings';
import dotSyntax from './transformers/dot-syntax';
import paletteTransform from './transformers/palette';
import pixelRemTransform from './transformers/pixel-rem';

const createGlobalConfig = (schemaInputDir: string): Config => ({
  source: [`${schemaInputDir}/**/*.tsx`],
  include: [
    path.join(THEME_INPUT_DIR, 'atlassian-light/**/*.tsx'),
    path.join(THEME_INPUT_DIR, 'atlassian-spacing/**/*.tsx'),
    path.join(THEME_INPUT_DIR, 'atlassian-typography/**/*.tsx'),
    path.join(THEME_INPUT_DIR, 'atlassian-shape/**/*.tsx'),
    path.join(THEME_INPUT_DIR, 'default/**/*.tsx'),
  ],
  parsers: [
    {
      pattern: /\.tsx$/,
      // Because we're using ESM we need to return the default property,
      // else we get "default" in our token paths.
      parse: ({ filePath }) => require(filePath).default,
    },
  ],
  transform: {
    'name/dot': dotSyntax,
    'pixel/rem': pixelRemTransform,
    'color/palette': paletteTransform({
      ...defaultPalette,
      ...spacingScale,
      ...typographyPalette,
      ...shapePalette,
    }),
  },
  format: {
    'replacement-mapper': formatterReplacementMapper as any,
    'csv/token-descriptions': formatterTokenDescriptionCSV as any,
    'typescript/token-names': formatterTSTokenNames as any,
    'typescript/token-default-values': formatterTSTokenDefaults as any,
    'typescript/token-types': formatterTSGeneratedTypes as any,
    'typescript/token-types-internal': formatterTSGeneratedTypesInternal as any,
    'typescript/generate-recommended-pairs':
      formatterTSGeneratedPairings as any,
    'css/dynamic-import-map': formatterDynamicImportMap as any,
  },
  platforms: {
    replacementMapper: {
      transforms: ['name/dot'],
      buildPath: ARTIFACT_OUTPUT_DIR,
      files: [
        {
          format: 'replacement-mapper',
          destination: `replacement-mapping.tsx`,
        },
      ],
    },
    csv: {
      transforms: ['name/dot'],
      buildPath: ARTIFACT_OUTPUT_DIR,
      options: {
        groups: ['paint', 'shadow', 'opacity', 'raw'],
      },
      files: [
        {
          format: 'csv/token-descriptions',
          destination: 'token-descriptions.csv',
        },
      ],
    },
    ts: {
      transforms: ['name/dot', 'color/palette', 'pixel/rem'],
      buildPath: ARTIFACT_OUTPUT_DIR,
      files: [
        {
          format: 'typescript/token-names',
          destination: 'token-names.tsx',
        },
        {
          format: 'typescript/token-types-internal',
          destination: 'types-internal.tsx',
        },
        {
          format: 'typescript/token-types',
          destination: 'types.tsx',
        },
        {
          format: 'typescript/token-default-values',
          destination: 'token-default-values.tsx',
        },
        {
          format: 'typescript/generate-recommended-pairs',
          destination: 'generated-pairs.tsx',
        },
      ],
    },
    dynamicModuleMap: {
      transforms: ['name/dot', 'color/palette'],
      buildPath: ARTIFACT_OUTPUT_DIR,
      files: [
        {
          format: 'css/dynamic-import-map',
          destination: 'theme-import-map.tsx',
        },
      ],
    },
  },
});

export default function build(styleDictionary: Core) {
  const schemaInputDir = `${__dirname}/../../src/tokens/default`;
  const config = createGlobalConfig(schemaInputDir);
  styleDictionary.extend(config).buildAllPlatforms();
}
