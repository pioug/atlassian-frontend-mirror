import type { IconColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/legacy-palette';

const color: ValueSchema<IconColorTokenSchema<BaseToken>> = {
	color: {
		icon: {
			'[default]': {
				value: 'DN800',
			},
			subtle: {
				value: 'DN40',
			},
			inverse: { value: 'DN40' },
			disabled: { value: 'DN400A' },
			brand: {
				value: 'B100',
			},
			selected: {
				value: 'B100',
			},
			danger: {
				value: 'R100',
			},
			warning: {
				'[default]': {
					value: 'Y75',
				},
				inverse: {
					value: 'DN40',
				},
			},
			success: {
				value: 'G200',
			},
			discovery: {
				value: 'P100',
			},
			information: {
				value: 'B75',
			},
		},
	},
};

export default color;
