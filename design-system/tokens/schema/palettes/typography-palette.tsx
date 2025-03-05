import {
	type FontFamilyPaletteTokenSchema,
	type FontSizeScaleTokenSchema,
	type FontWeightScaleTokenSchema,
	type LetterSpacingScaleTokenSchema,
	type LineHeightScaleTokenSchema,
} from '../../src/types';

export type FontSizeScaleValues =
	| 'FontSizeCode'
	| 'LegacyFontSize11'
	| 'FontSize12'
	| 'FontSize14'
	| 'FontSize16'
	| 'FontSize20'
	| 'FontSize24'
	| 'FontSize28'
	| 'LegacyFontSize29'
	| 'FontSize32'
	| 'LegacyFontSize35'
	| 'FontSize36'
	| 'FontSize48';

export type LineHeightScaleValues =
	| 'LineHeight1'
	| 'LineHeight16'
	| 'LineHeight20'
	| 'LineHeight24'
	| 'LineHeight28'
	| 'LineHeight32'
	| 'LineHeight36'
	| 'LineHeight40'
	| 'LineHeight48'
	| 'LineHeight56';

export type FontWeightScaleValues =
	| 'FontWeight400'
	| 'FontWeight500'
	| 'FontWeight600'
	| 'FontWeight653'
	| 'FontWeight700';

export type FontFamilyPaletteValues =
	| 'FontFamilyCharlieDisplay'
	| 'FontFamilyCharlieText'
	| 'FontFamilyWebSans'
	| 'FontFamilyWebSansRefreshed'
	| 'LegacyFontFamilyWebSans'
	| 'FontFamilyiOSSans'
	| 'FontFamilyAndroidSans'
	| 'FontFamilyWebMono'
	| 'FontFamilyWebMonoRefreshed'
	| 'FontFamilyiOSMono'
	| 'FontFamilyAndroidMono';

export type LetterSpacingScaleValues =
	| 'LetterSpacing0'
	| 'LetterSpacing100'
	| 'LetterSpacing200'
	| 'LetterSpacing300'
	| 'LetterSpacing400';

export type AtlassianTokenSchema = {
	typography:
		| FontSizeScaleTokenSchema<FontSizeScaleValues>
		| FontWeightScaleTokenSchema<FontWeightScaleValues>
		| FontFamilyPaletteTokenSchema<FontFamilyPaletteValues>
		| LineHeightScaleTokenSchema<LineHeightScaleValues>
		| LetterSpacingScaleTokenSchema<LetterSpacingScaleValues>;
};

export type LetterSpacingBaseToken =
	keyof LetterSpacingScaleTokenSchema<LetterSpacingScaleValues>['letterSpacing'];

const letterSpacingScale: LetterSpacingScaleTokenSchema<LetterSpacingScaleValues> = {
	letterSpacing: {
		LetterSpacing0: {
			value: '0',
			attributes: {
				group: 'letterSpacing',
			},
		},
		LetterSpacing100: {
			value: '-0.003em',
			attributes: {
				group: 'letterSpacing',
			},
		},
		LetterSpacing200: {
			value: '-0.006em',
			attributes: {
				group: 'letterSpacing',
			},
		},
		LetterSpacing300: {
			value: '-0.008em',
			attributes: {
				group: 'letterSpacing',
			},
		},
		LetterSpacing400: {
			value: '-0.01em',
			attributes: {
				group: 'letterSpacing',
			},
		},
	},
};

export type LineHeightBaseToken =
	keyof LineHeightScaleTokenSchema<LineHeightScaleValues>['lineHeight'];

const lineHeightScale: LineHeightScaleTokenSchema<LineHeightScaleValues> = {
	lineHeight: {
		LineHeight1: {
			value: '1',
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight16: {
			value: 16,
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight20: {
			value: 20,
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight24: {
			value: 24,
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight28: {
			value: 28,
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight32: {
			value: 32,
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight36: {
			value: 36,
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight40: {
			value: 40,
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight48: {
			value: 48,
			attributes: {
				group: 'lineHeight',
			},
		},
		LineHeight56: {
			value: 56,
			attributes: {
				group: 'lineHeight',
			},
		},
	},
};

export type FontWeightBaseToken =
	keyof FontWeightScaleTokenSchema<FontWeightScaleValues>['fontWeight'];

const fontWeightScale: FontWeightScaleTokenSchema<FontWeightScaleValues> = {
	fontWeight: {
		FontWeight400: {
			value: '400',
			attributes: {
				group: 'fontWeight',
			},
		},
		FontWeight500: {
			value: '500',
			attributes: {
				group: 'fontWeight',
			},
		},
		FontWeight600: {
			value: '600',
			attributes: {
				group: 'fontWeight',
			},
		},
		FontWeight653: {
			value: '653',
			attributes: {
				group: 'fontWeight',
			},
		},
		FontWeight700: {
			value: '700',
			attributes: {
				group: 'fontWeight',
			},
		},
	},
};

export type FontFamilyBaseToken =
	keyof FontFamilyPaletteTokenSchema<FontFamilyPaletteValues>['fontFamily'];

const fontFamilyPalette: FontFamilyPaletteTokenSchema<FontFamilyPaletteValues> = {
	fontFamily: {
		FontFamilyCharlieDisplay: {
			value:
				'"Charlie Display", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
			attributes: {
				group: 'fontFamily',
			},
		},
		FontFamilyCharlieText: {
			value:
				'"Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
			attributes: {
				group: 'fontFamily',
			},
		},
		LegacyFontFamilyWebSans: {
			value: `-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif`,
			attributes: {
				group: 'fontFamily',
			},
		},
		/**
		 * @see https://infinnie.github.io/blog/2017/systemui.html
		 * @see https://github.com/twbs/bootstrap/pull/22377
		 * @see https://fonts.google.com/knowledge/glossary/system_font_web_safe_font
		 */
		FontFamilyWebSans: {
			value: `ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Ubuntu, \"Helvetica Neue\", sans-serif`,
			attributes: {
				group: 'fontFamily',
			},
		},
		FontFamilyWebSansRefreshed: {
			value: `\"Atlassian Sans\", ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Ubuntu, \"Helvetica Neue\", sans-serif`,
			attributes: {
				group: 'fontFamily',
			},
		},
		FontFamilyiOSSans: {
			value: 'SF Pro',
			attributes: {
				group: 'fontFamily',
			},
		},
		FontFamilyAndroidSans: {
			value: 'Roboto',
			attributes: {
				group: 'fontFamily',
			},
		},
		FontFamilyWebMono: {
			value: `ui-monospace, Menlo, \"Segoe UI Mono\", \"Ubuntu Mono\", monospace`,
			attributes: {
				group: 'fontFamily',
			},
		},
		FontFamilyWebMonoRefreshed: {
			value: `\"Atlassian Mono\", ui-monospace, Menlo, \"Segoe UI Mono\", \"Ubuntu Mono\", monospace`,
			attributes: {
				group: 'fontFamily',
			},
		},
		FontFamilyiOSMono: {
			value: 'SF Mono',
			attributes: {
				group: 'fontFamily',
			},
		},
		FontFamilyAndroidMono: {
			value: 'Roboto Mono',
			attributes: {
				group: 'fontFamily',
			},
		},
	},
};

export type FontSizeBaseToken = keyof FontSizeScaleTokenSchema<FontSizeScaleValues>['fontSize'];

const fontSizeScale: FontSizeScaleTokenSchema<FontSizeScaleValues> = {
	fontSize: {
		FontSizeCode: {
			value: '0.875em',
			attributes: {
				group: 'fontSize',
			},
		},
		LegacyFontSize11: {
			value: 11,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize12: {
			value: 12,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize14: {
			value: 14,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize16: {
			value: 16,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize20: {
			value: 20,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize24: {
			value: 24,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize28: {
			value: 28,
			attributes: {
				group: 'fontSize',
			},
		},
		LegacyFontSize29: {
			value: 29,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize32: {
			value: 32,
			attributes: {
				group: 'fontSize',
			},
		},
		LegacyFontSize35: {
			value: 35,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize36: {
			value: 36,
			attributes: {
				group: 'fontSize',
			},
		},
		FontSize48: {
			value: 48,
			attributes: {
				group: 'fontSize',
			},
		},
	},
};

const typographyPalette: AtlassianTokenSchema = {
	typography: {
		...fontSizeScale,
		...fontWeightScale,
		...fontFamilyPalette,
		...lineHeightScale,
		...letterSpacingScale,
	},
};

export default typographyPalette;
