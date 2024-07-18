import type { IconBrandRefreshColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<IconBrandRefreshColorTokenSchema<BaseToken>> = {
	color: {
		icon: {
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
				value: 'Red700',
			},
			warning: {
				'[default]': {
					value: 'Orange600',
				},
				inverse: {
					value: 'Neutral1000',
				},
			},
			success: {
				value: 'Lime600',
			},
			discovery: {
				value: 'Purple600',
			},
			information: {
				value: 'Blue600',
			},
		},
	},
};

export default color;
