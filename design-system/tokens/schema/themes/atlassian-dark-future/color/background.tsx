import type { BackgroundColorTokenSchema, DeepPartial, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<DeepPartial<BackgroundColorTokenSchema<BaseToken>>> = {
	color: {
		background: {
			disabled: { value: 'Lime300' },
		},
	},
};

export default color;
