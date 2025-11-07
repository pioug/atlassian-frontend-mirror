import type { IconColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<IconColorTokenSchema<BaseToken>> = {
	color: {
		icon: {
			'[default]': {
				value: 'DarkNeutral1000',
			},
			subtle: {
				value: 'DarkNeutral800',
			},
			subtlest: {
				value: 'DarkNeutral700',
			},
			inverse: {
				value: 'DarkNeutral100',
			},
			disabled: {
				value: 'DarkNeutral400A',
			},
			brand: {
				value: 'Blue400',
			},
			selected: {
				value: 'Blue400',
			},
			danger: {
				value: 'Red500',
			},
			warning: {
				'[default]': {
					value: 'Orange300',
				},
				inverse: {
					value: 'DarkNeutral100',
				},
			},
			success: {
				value: 'Lime500',
			},
			discovery: {
				value: 'Purple500',
			},
			information: {
				value: 'Blue500',
			},
		},
	},
};

export default color;
