import type { InteractionColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<InteractionColorTokenSchema<BaseToken>> = {
	color: {
		interaction: {
			hovered: {
				// @ts-ignore temporary values
				value: '#ffffff33',
			},
			pressed: {
				// @ts-ignore temporary values
				value: '#ffffff5c',
			},
		},
	},
};

export default color;
