import type { ExtendedValueSchema, TextColorTokenSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<TextColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			'[default]': {
				value: 'DarkNeutral1100',
			},
			subtle: {
				value: 'DarkNeutral1000',
			},
			subtlest: {
				value: 'DarkNeutral900',
			},
			brand: {
				value: 'Blue200',
			},
			selected: {
				value: 'Blue200',
			},
			danger: {
				'[default]': {
					value: 'Red200',
				},
				bolder: {
					value: 'Red100',
				},
			},
			warning: {
				'[default]': {
					value: 'Orange200',
				},
				inverse: {
					value: 'DarkNeutral0',
				},
				bolder: {
					value: 'Orange100',
				},
			},
			success: {
				'[default]': {
					value: 'Green200',
				},
				bolder: {
					value: 'Green100',
				},
			},
			information: {
				'[default]': {
					value: 'Blue200',
				},
				bolder: {
					value: 'Blue100',
				},
			},
			discovery: {
				'[default]': {
					value: 'Purple200',
				},
				bolder: {
					value: 'Purple100',
				},
			},
		},
		link: {
			'[default]': {
				value: 'Blue200',
			},
			pressed: {
				value: 'Blue200',
			},
		},
	},
};

export default color;
