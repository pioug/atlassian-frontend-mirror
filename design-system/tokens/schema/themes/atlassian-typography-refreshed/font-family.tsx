import { type FontFamilyTokenSchema, type ValueSchema } from '../../../src/types';
import { type FontFamilyBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: ValueSchema<FontFamilyTokenSchema<BaseToken>> = {
	font: {
		family: {
			sans: { value: 'FontFamilyWebSansRefreshed' },
			monospace: { value: 'FontFamilyWebMonoRefreshed' },
			body: { value: 'FontFamilyWebSansRefreshed' },
			heading: { value: 'FontFamilyWebSansRefreshed' },
			brand: {
				heading: { value: 'FontFamilyCharlieDisplay' },
				body: { value: 'FontFamilyCharlieText' },
			},
			code: { value: 'FontFamilyWebMonoRefreshed' },
		},
	},
};

export default font;
