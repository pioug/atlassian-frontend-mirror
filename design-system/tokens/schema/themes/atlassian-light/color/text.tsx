import type { TextColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<TextColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			'[default]': {
				value: 'Neutral1000',
			},
			subtle: {
				value: 'Neutral800',
			},
			subtlest: {
				value: 'Neutral700',
			},
			inverse: {
				value: 'Neutral0',
			},
			disabled: {
				value: 'Neutral400A',
			},
			brand: {
				value: 'Blue700',
			},
			selected: {
				value: 'Blue700',
			},
			danger: {
				'[default]': {
					value: 'Red800',
				},
				bolder: {
					value: 'Red900',
				},
			},
			warning: {
				'[default]': {
					value: 'Orange800',
				},
				inverse: {
					value: 'Neutral1000',
				},
				bolder: {
					value: 'Orange900',
				},
			},
			success: {
				'[default]': {
					value: 'Lime800',
				},
				bolder: {
					value: 'Lime900',
				},
			},
			information: {
				'[default]': {
					value: 'Blue800',
				},
				bolder: {
					value: 'Blue900',
				},
			},
			discovery: {
				'[default]': {
					value: 'Purple800',
				},
				bolder: {
					value: 'Purple900',
				},
			},
		},
		link: {
			'[default]': {
				value: 'Blue700',
			},
			pressed: {
				value: 'Blue800',
			},
			visited: {
				'[default]': {
					value: 'Purple800',
				},
				pressed: {
					value: 'Purple900',
				},
			},
		},
	},
};

export default color;
