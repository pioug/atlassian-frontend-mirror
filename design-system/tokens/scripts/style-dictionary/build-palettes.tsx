import fs from 'fs';
import path from 'path';

import { Config, Core } from 'style-dictionary';

import { ARTIFACT_OUTPUT_DIR } from './constants';
import formatterRaw from './formatters/raw';
import dotSyntax from './transformers/dot-syntax';

const PALETTE_INPUT_DIR = './src/palettes/';

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
    'name/dot': dotSyntax,
  },
  format: {
    raw: formatterRaw as any,
  },
  platforms: {
    rawPalette: {
      transforms: ['name/dot'],
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

export default function build(styleDictionary: Core) {
  const paletteInputDir = `${__dirname}/../../src/palettes`;

  fs.readdirSync(paletteInputDir, { withFileTypes: true })
    .filter((result) => !result.isDirectory())
    .forEach((palette) => {
      const config = createPaletteConfig(palette.name);
      styleDictionary.extend(config).buildAllPlatforms();
    });
}
