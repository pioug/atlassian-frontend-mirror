import type { TypographyTokenSchema, UtilTokenSchema, ValueSchema } from '../../../src/types';
import { type BaseToken } from '../../palettes/palette';
import type {
	FontFamilyBaseToken,
	FontSizeBaseToken,
	FontWeightBaseToken,
	LetterSpacingBaseToken,
	LineHeightBaseToken,
} from '../../palettes/typography-palette';

const utility: ValueSchema<UtilTokenSchema<BaseToken>> = {
	// @ts-expect-error in complete utility theme
	UNSAFE: {
		textTransformUppercase: {
			value: 'uppercase',
		},
	},
};

const typography: ValueSchema<
	TypographyTokenSchema<{
		fontWeight: FontWeightBaseToken;
		fontFamily: FontFamilyBaseToken;
		fontSize: FontSizeBaseToken;
		lineHeight: LineHeightBaseToken;
		letterSpacing: LetterSpacingBaseToken;
	}>
> = {
	font: {
		heading: {
			xxlarge: {
				value: {
					fontWeight: 'FontWeight500',
					fontSize: 'LegacyFontSize35',
					lineHeight: 'LineHeight40',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing400',
				},
			},
			xlarge: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'LegacyFontSize29',
					lineHeight: 'LineHeight32',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing400',
				},
			},
			large: {
				value: {
					fontWeight: 'FontWeight500',
					fontSize: 'FontSize24',
					lineHeight: 'LineHeight28',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing400',
				},
			},
			medium: {
				value: {
					fontWeight: 'FontWeight500',
					fontSize: 'FontSize20',
					lineHeight: 'LineHeight24',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing300',
				},
			},
			small: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize16',
					lineHeight: 'LineHeight20',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing200',
				},
			},
			xsmall: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize14',
					lineHeight: 'LineHeight16',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing100',
				},
			},
			xxsmall: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize12',
					lineHeight: 'LineHeight16',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
		},
		code: {
			'[default]': {
				value: {
					fontWeight: 'FontWeight400',
					fontSize: 'FontSizeCode',
					lineHeight: 'LineHeight1',
					fontFamily: 'FontFamilyWebMono',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
		},
		body: {
			'[default]': {
				value: {
					fontWeight: 'FontWeight400',
					fontSize: 'FontSize14',
					lineHeight: 'LineHeight20',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			large: {
				value: {
					fontWeight: 'FontWeight400',
					fontSize: 'FontSize16',
					lineHeight: 'LineHeight24',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			small: {
				value: {
					fontWeight: 'FontWeight400',
					fontSize: 'LegacyFontSize11',
					lineHeight: 'LineHeight16',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			UNSAFE_small: {
				value: {
					fontWeight: 'FontWeight400',
					fontSize: 'FontSize12',
					lineHeight: 'LineHeight16',
					fontFamily: 'FontFamilyWebSans',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
		},
	},
};

export default {
	font: typography.font,
	utility,
};
