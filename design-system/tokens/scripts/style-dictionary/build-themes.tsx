import fs from 'fs';
import path from 'path';

import { type Config, type Core } from 'style-dictionary';

import motionPalette from '../../schema/palettes/motion-palette';
import defaultPalette from '../../schema/palettes/palette';
import shapePalette from '../../schema/palettes/shape-palette';
import spacingScale from '../../schema/palettes/spacing-scale';
import typographyPalette from '../../schema/palettes/typography-palette';
import { dynamicColorCustomProperties } from '../../schema/themes/UNSAFE-dynamic/_formulas';
import themeConfig, { type Palettes, type ThemeFileNames } from '../../src/theme-config';
import {
	ARTIFACT_OUTPUT_DIR,
	FIGMA_ARTIFACT_OUTPUT_DIR,
	THEME_INPUT_DIR,
	TOKENS_INPUT_DIR,
} from './constants';
import { type CustomProperty } from './formatters/css-variable-formatter';
import { default as formatterCSSVariables } from './formatters/css-variables';
import formatterCSSVariablesAsModule from './formatters/css-variables-as-module';
import formatterFigma from './formatters/figma';
import { formatter as formatterTSTokenValueForContrastCheck } from './formatters/formatter';
import formatterRaw from './formatters/raw';
import { default as motionTransform } from './transformers/animation';
import boxShadowTransform from './transformers/box-shadow';
import dotSyntax from './transformers/dot-syntax';
import numberPixelTransform from './transformers/number-pixel';
import paletteTransform from './transformers/palette';
import pixelRemTransform from './transformers/pixel-rem';
import { default as fontTransform } from './transformers/web-font';

/**
 * Lists the token source files in a theme folder, in the same order as a `**\/*.tsx` glob.
 *
 * A theme folder can also hold files that aren't token sources, which are skipped:
 * - files prefixed with `_`, e.g. `_formulas.tsx` for shared helpers used by the theme's tokens
 * - anything inside `__tests__`
 */
const getThemeTokenFiles = (themeName: ThemeFileNames): string[] => {
	const walk = (dir: string): string[] =>
		fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
			const entryPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				return entry.name === '__tests__' ? [] : walk(entryPath);
			}
			return entry.name.endsWith('.tsx') && !entry.name.startsWith('_') ? [entryPath] : [];
		});

	return walk(path.join(THEME_INPUT_DIR, themeName)).sort((a, b) => a.localeCompare(b, 'en'));
};

/**
 * Shared values declared once per theme in the CSS output and referenced by tokens with `var()`,
 * rather than repeated in every token that uses them.
 */
const themeCustomProperties: Partial<Record<ThemeFileNames, readonly CustomProperty[]>> = {
	'UNSAFE-dynamic': dynamicColorCustomProperties,
	'UNSAFE-dynamic-dark': dynamicColorCustomProperties,
};

const getPalette = (paletteId: Palettes) => {
	switch (paletteId) {
		case 'spacingScale':
			return spacingScale;
		case 'typographyPalette':
			return typographyPalette;
		case 'shapePalette':
			return shapePalette;
		case 'motionPalette':
			return motionPalette;
		case 'defaultPalette':
		default:
			return defaultPalette;
	}
};

/**
 * Recursively find all base themes that the theme extends.
 */
const getBaseThemes = (themeName: ThemeFileNames): ThemeFileNames[] => {
	let baseTheme;
	const extendedTheme = themeConfig[themeName].extends || themeConfig[themeName].attributes.extends;
	if (extendedTheme) {
		baseTheme = Object.entries(themeConfig).find(
			([, { id }]) => id === extendedTheme,
		)?.[0] as ThemeFileNames;
	}

	const furtherExtensions = baseTheme ? getBaseThemes(baseTheme as ThemeFileNames) : [];

	return baseTheme ? [baseTheme, ...furtherExtensions] : [];
};

/**
 * Finds theme targeted for increased contrast.
 */
const getIncreasedContrastTargetTheme = (themeName: ThemeFileNames): ThemeFileNames | undefined => {
	let increasedContrastFor = themeConfig[themeName].increasesContrastFor;

	if (!increasedContrastFor && themeConfig[themeName].override) {
		increasedContrastFor = Object.values(themeConfig).find(
			({ id }) => id === themeConfig[themeName].override,
		)?.increasesContrastFor;
	}

	let targetTheme;
	if (increasedContrastFor) {
		targetTheme = Object.entries(themeConfig).find(
			([, { id }]) => id === increasedContrastFor,
		)?.[0] as ThemeFileNames;
	}

	return targetTheme;
};

const createThemeConfig = (
	themeName: ThemeFileNames,
	baseThemes: ThemeFileNames[],
	palette: ReturnType<typeof getPalette>,
	increasedContrastTarget?: ThemeFileNames,
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
			'font/web': fontTransform,
			'motion/animation': motionTransform,
		},
		source: getThemeTokenFiles(themeName),
		include: [
			/**
			 * Adds base themes as source for extension themes.
			 */
			...baseThemes.flatMap(getThemeTokenFiles),
			path.join(TOKENS_INPUT_DIR, '**', '*.tsx'),
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
				transforms: ['name/dot', 'color/palette', 'raw/pixel', 'font/web'],
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
					'motion/animation',
				],
				buildPath: path.join(ARTIFACT_OUTPUT_DIR, 'themes/'),
				options: {
					themeName,
					increasedContrastTarget,
					customProperties: themeCustomProperties[themeName],
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
			transforms: ['name/dot', 'color/palette', 'pixel/rem', 'box-shadow/figma'],
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

export default function build(styleDictionary: Core): void {
	const tokensInputDir = `${__dirname}/../../${THEME_INPUT_DIR}`;

	fs.readdirSync(tokensInputDir, { withFileTypes: true })
		.filter((result) => result.isDirectory())
		.forEach((theme) => {
			const themeName = theme.name as ThemeFileNames;
			const baseThemes = getBaseThemes(themeName);
			const increasedContrastTarget = getIncreasedContrastTargetTheme(themeName);
			const palette = getPalette(themeConfig[themeName].palette);
			const config = createThemeConfig(themeName, baseThemes, palette, increasedContrastTarget);
			styleDictionary.extend(config).buildAllPlatforms();
		});
}
