import type { TextColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/legacy-palette';

const color: ValueSchema<TextColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			'[default]': { value: 'N800' },
			subtle: { value: 'N500' },
			subtlest: { value: 'N100' },
			inverse: { value: 'N0' },
			disabled: { value: 'N70' },
			brand: { value: 'B300' },
			selected: { value: 'B400' },
			danger: { value: 'R400' },
			warning: {
				'[default]': { value: 'O800' },
				inverse: { value: 'N800' },
			},
			success: { value: 'G500' },
			information: { value: 'B400' },
			discovery: { value: 'P500' },
		},
		link: {
			'[default]': { value: 'B400' },
			pressed: { value: 'B500' },
			visited: {
				'[default]': { value: 'P500' },
				pressed: { value: 'P500' },
			},
		},
	},
};

export default color;
