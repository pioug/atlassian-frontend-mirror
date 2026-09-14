import type { BorderColorTokenSchema, DeepPartial, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<DeepPartial<BorderColorTokenSchema<BaseToken>>> = {
	color: {
		border: {
			selected: { value: 'Neutral1000' },
		},
	},
};

export default color;
