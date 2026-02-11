import fs from 'fs';
import path from 'path';

import { type Config, type Core } from 'style-dictionary';

import { ARTIFACT_OUTPUT_DIR } from './constants';
import formatterRaw from './formatters/raw';
import dotSyntax from './transformers/dot-syntax';
import rawPixel from './transformers/number-pixel';

const PALETTE_INPUT_DIR = './schema/palettes/';

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
		'raw/pixel': rawPixel,
	},
	format: {
		raw: formatterRaw as any,
	},
	platforms: {
		rawPalette: {
			transforms: ['name/dot', 'raw/pixel'],
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

export default function build(styleDictionary: Core): void {
	const paletteInputDir = `${__dirname}/../../schema/palettes`;

	fs.readdirSync(paletteInputDir, { withFileTypes: true })
		.filter((result) => !result.isDirectory())
		.forEach((palette) => {
			const config = createPaletteConfig(palette.name);
			styleDictionary.extend(config).buildAllPlatforms();
		});
}
