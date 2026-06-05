import type { BorderColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<BorderColorTokenSchema<BaseToken>> = {
	color: {
		border: {
			'[default]': {
				value: 'DarkNeutral300A',
			},
			bold: {
				value: 'DarkNeutral600',
			},
			inverse: {
				value: 'DarkNeutral0',
			},
			focused: {
				value: 'Blue300',
			},
			input: {
				value: 'DarkNeutral600',
			},
			disabled: {
				value: 'DarkNeutral200A',
			},
			brand: {
				value: 'Blue400',
			},
			selected: {
				value: 'Blue400',
			},
			danger: {
				'[default]': { value: 'Red500' },
				subtle: { value: 'Red800' },
			},
			warning: {
				'[default]': { value: 'Orange500' },
				subtle: { value: 'Orange800' },
			},
			success: {
				'[default]': { value: 'Lime500' },
				subtle: { value: 'Lime800' },
			},
			discovery: {
				'[default]': { value: 'Purple500' },
				subtle: { value: 'Purple800' },
			},
			information: {
				'[default]': { value: 'Blue500' },
				subtle: { value: 'Blue800' },
			},
		},
	},
};

export default color;
