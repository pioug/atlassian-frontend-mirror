import type { ExtendedValueSchema, IconColorTokenSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<IconColorTokenSchema<BaseToken>> = {
	color: {
		icon: {
			'[default]': {
				value: 'Neutral1000',
			},
			subtle: {
				value: 'Neutral900',
			},
			// TODO: Confirm - was not included in theme design but seems like it should be darker
			// disabled: {
			//   value: 'Neutral400A',
			// },
			brand: {
				value: 'Blue800',
			},
			selected: {
				value: 'Blue800',
			},
			danger: {
				value: 'Red700',
			},
			warning: {
				'[default]': {
					value: 'Orange800',
				},
				inverse: {
					value: 'Neutral0',
				},
			},
			success: {
				value: 'Green800',
			},
			discovery: {
				value: 'Purple700',
			},
			information: {
				value: 'Blue800',
			},
		},
	},
};

export default color;
