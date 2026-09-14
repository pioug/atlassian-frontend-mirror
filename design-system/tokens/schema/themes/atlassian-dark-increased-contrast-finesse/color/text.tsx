import type { DeepPartial, TextColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<DeepPartial<TextColorTokenSchema<BaseToken>>> = {
	color: {
		text: {
			selected: { value: 'DarkNeutral1000' },
		},
	},
};

export default color;
