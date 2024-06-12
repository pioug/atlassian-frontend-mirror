import { type LineHeightTokenSchema, type ValueSchema } from '../../../src/types';
import { type LineHeightBaseToken as BaseToken } from '../../palettes/typography-palette';

const font: ValueSchema<LineHeightTokenSchema<BaseToken>> = {
	font: {
		lineHeight: {
			'1': { value: 'LineHeight1' },
			'100': { value: 'LineHeight16' },
			'200': { value: 'LineHeight20' },
			'300': { value: 'LineHeight24' },
			'400': { value: 'LineHeight28' },
			'500': { value: 'LineHeight32' },
			'600': { value: 'LineHeight40' },
		},
	},
};

export default font;
