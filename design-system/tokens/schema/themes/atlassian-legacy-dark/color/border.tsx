import type { BorderColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/legacy-palette';

const color: ValueSchema<BorderColorTokenSchema<BaseToken>> = {
	color: {
		border: {
			'[default]': {
				value: 'DN40',
			},
			bold: {
				value: 'DN200',
			},
			inverse: {
				value: 'DN0',
			},
			focused: {
				value: 'B75',
			},
			input: {
				value: 'DN40',
			},
			disabled: {
				value: 'DN10',
			},
			brand: {
				value: 'B400',
			},
			selected: {
				value: 'B400',
			},
			danger: {
				value: 'R400',
			},
			warning: {
				value: 'Y500',
			},
			success: {
				value: 'G500',
			},
			discovery: {
				value: 'P500',
			},
			information: {
				value: 'B500',
			},
		},
	},
};

export default color;
