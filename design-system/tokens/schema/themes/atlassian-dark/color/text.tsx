import type { TextColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<TextColorTokenSchema<BaseToken>> = {
	color: {
		text: {
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
				value: 'Red300',
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
				value: 'Lime300',
			},
			information: {
				value: 'Blue300',
			},
			discovery: {
				value: 'Purple300',
			},
		},
		link: {
			'[default]': {
				value: 'Blue400',
			},
			pressed: {
				value: 'Blue300',
			},
			visited: {
				'[default]': {
					value: 'Purple300',
				},
				pressed: {
					value: 'Purple200',
				},
			},
		},
	},
};

export default color;
