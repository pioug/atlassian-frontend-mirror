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
			medium: {
				value: {
					fontWeight: 'FontWeight500',
					fontSize: 'FontSize20',
					lineHeight: 'LineHeight24',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			small: {
				value: {
					fontWeight: 'FontWeight500',
					fontSize: 'FontSize16',
					lineHeight: 'LineHeight20',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			xsmall: {
				value: {
					fontWeight: 'FontWeight500',
					fontSize: 'FontSize14',
					lineHeight: 'LineHeight20',
					fontFamily: 'FontFamilyWebSansRefreshed',
					fontStyle: 'normal',
					letterSpacing: 'LetterSpacing0',
				},
			},
			xxsmall: {
				value: {
					fontWeight: 'FontWeight500',
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
