import type { DeepPartial, TypographyTokenSchema, ValueSchema } from '../../../src/types';
import type {
	FontFamilyBaseToken,
	FontSizeBaseToken,
	FontWeightBaseToken,
	LetterSpacingBaseToken,
	LineHeightBaseToken,
} from '../../palettes/typography-palette';

const typography: ValueSchema<
	DeepPartial<
		TypographyTokenSchema<{
			fontWeight: FontWeightBaseToken;
			fontFamily: FontFamilyBaseToken;
			fontSize: FontSizeBaseToken;
			lineHeight: LineHeightBaseToken;
			letterSpacing: LetterSpacingBaseToken;
		}>
	>
> = {
	font: {
		heading: {
			xxlarge: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize32',
					lineHeight: 'LineHeight36',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			xlarge: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize28',
					lineHeight: 'LineHeight32',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			large: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize24',
					lineHeight: 'LineHeight28',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			medium: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize20',
					lineHeight: 'LineHeight24',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			small: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize16',
					lineHeight: 'LineHeight20',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			xsmall: {
				value: {
					fontWeight: 'FontWeight600',
					fontSize: 'FontSize14',
					lineHeight: 'LineHeight20',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			xxsmall: {
				value: {
					fontWeight: 'FontWeight600',
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

export default typography;
