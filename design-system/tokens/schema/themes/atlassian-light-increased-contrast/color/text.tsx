import type { ExtendedValueSchema, TextColorTokenSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<TextColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			'[default]': {
				value: 'Neutral1100',
			},
			subtle: {
				value: 'Neutral1000',
			},
			subtlest: {
				value: 'Neutral900',
			},
			brand: {
				value: 'Blue900',
			},
			selected: {
				value: 'Blue900',
			},
			danger: {
				'[default]': {
					value: 'Red900',
				},
				bolder: {
					value: 'Red1000',
				},
			},
			warning: {
				'[default]': {
					value: 'Orange900',
				},
				inverse: {
					value: 'Neutral0',
				},
				bolder: {
					value: 'Orange1000',
				},
			},
			success: {
				'[default]': {
					value: 'Green900',
				},
				bolder: {
					value: 'Green1000',
				},
			},
			information: {
				'[default]': {
					value: 'Blue900',
				},
				bolder: {
					value: 'Blue1000',
				},
			},
			discovery: {
				'[default]': {
					value: 'Purple900',
				},
				bolder: {
					value: 'Purple1000',
				},
			},
		},
		link: {
			'[default]': {
				value: 'Blue900',
			},
			pressed: {
				value: 'Blue900',
			},
		},
	},
};

export default color;
