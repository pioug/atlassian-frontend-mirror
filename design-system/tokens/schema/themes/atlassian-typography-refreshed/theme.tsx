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
					fontWeight: 'FontWeight653',
					fontSize: 'FontSize32',
					lineHeight: 'LineHeight36',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			xlarge: {
				value: {
					fontWeight: 'FontWeight653',
					fontSize: 'FontSize28',
					lineHeight: 'LineHeight32',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			large: {
				value: {
					fontWeight: 'FontWeight653',
					fontSize: 'FontSize24',
					lineHeight: 'LineHeight28',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			medium: {
				value: {
					fontWeight: 'FontWeight653',
					fontSize: 'FontSize20',
					lineHeight: 'LineHeight24',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			small: {
				value: {
					fontWeight: 'FontWeight653',
					fontSize: 'FontSize16',
					lineHeight: 'LineHeight20',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			xsmall: {
				value: {
					fontWeight: 'FontWeight653',
					fontSize: 'FontSize14',
					lineHeight: 'LineHeight20',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			xxsmall: {
				value: {
					fontWeight: 'FontWeight653',
					fontSize: 'FontSize12',
					lineHeight: 'LineHeight16',
					fontFamily: 'FontFamilyWebSansRefreshed',
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
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			large: {
				value: {
					fontWeight: 'FontWeight400',
					fontSize: 'FontSize16',
					lineHeight: 'LineHeight24',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			small: {
				value: {
					fontWeight: 'FontWeight400',
					fontSize: 'FontSize12',
					lineHeight: 'LineHeight16',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			UNSAFE_small: {
				value: {
					fontWeight: 'FontWeight400',
					fontSize: 'FontSize12',
					lineHeight: 'LineHeight16',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
		},
	},
};

const theme = {
	font: typography.font,
	utility,
};

export default theme;
