import type { BorderColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<BorderColorTokenSchema<BaseToken>> = {
	color: {
		border: {
			'[default]': {
				value: 'Neutral300A',
			},
			bold: {
				value: 'Neutral600',
			},
			inverse: {
				value: 'Neutral0',
			},
			focused: {
				value: 'Blue500',
			},
			input: {
				value: 'Neutral500',
			},
			disabled: {
				value: 'Neutral200A',
			},
			brand: {
				value: 'Blue700',
			},
			selected: {
				value: 'Blue700',
			},
			danger: {
				'[default]': { value: 'Red600' },
				subtle: { value: 'Red300' },
			},
			warning: {
				'[default]': { value: 'Orange600' },
				subtle: { value: 'Orange300' },
			},
			success: {
				'[default]': { value: 'Lime600' },
				subtle: { value: 'Lime300' },
			},
			discovery: {
				'[default]': { value: 'Purple600' },
				subtle: { value: 'Purple300' },
			},
			information: {
				'[default]': { value: 'Blue600' },
				subtle: { value: 'Blue300' },
			},
		},
	},
};

export default color;
