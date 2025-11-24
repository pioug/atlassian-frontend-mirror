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
			danger: {
				'[default]': { value: 'R400' },
				bolder: { value: 'R500' },
			},
			warning: {
				'[default]': { value: 'O800' },
				inverse: { value: 'N800' },
				bolder: { value: 'O800' },
			},
			success: {
				'[default]': { value: 'G500' },
				bolder: { value: 'G500' },
			},
			information: {
				'[default]': { value: 'B400' },
				bolder: { value: 'B500' },
			},
			discovery: {
				'[default]': { value: 'P500' },
				bolder: { value: 'P500' },
			},
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
