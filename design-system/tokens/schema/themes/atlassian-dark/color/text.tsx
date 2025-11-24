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
				'[default]': {
					value: 'Red300',
				},
				bolder: {
					value: 'Red200',
				},
			},
			warning: {
				'[default]': {
					value: 'Orange300',
				},
				inverse: {
					value: 'DarkNeutral100',
				},
				bolder: {
					value: 'Orange200',
				},
			},
			success: {
				'[default]': {
					value: 'Lime300',
				},
				bolder: {
					value: 'Lime200',
				},
			},
			information: {
				'[default]': {
					value: 'Blue300',
				},
				bolder: {
					value: 'Blue200',
				},
			},
			discovery: {
				'[default]': {
					value: 'Purple300',
				},
				bolder: {
					value: 'Purple200',
				},
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
