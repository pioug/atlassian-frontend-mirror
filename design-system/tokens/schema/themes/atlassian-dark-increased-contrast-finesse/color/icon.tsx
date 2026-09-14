import type { DeepPartial, IconColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<DeepPartial<IconColorTokenSchema<BaseToken>>> = {
	color: {
		icon: {
			selected: { value: 'DarkNeutral1000' },
		},
	},
};

export default color;
