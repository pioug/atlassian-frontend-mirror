import type { SurfaceTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
	elevation: {
		surface: {
			'[default]': {
				'[default]': {
					value: 'Purple1000',
				},
				hovered: {
					value: 'Purple900',
				},
				pressed: {
					value: 'Purple850',
				},
			},
			sunken: {
				value: 'Magenta1000',
			},
			raised: {
				'[default]': {
					value: 'Purple900',
				},
				hovered: {
					value: 'Purple850',
				},
				pressed: {
					value: 'Purple800',
				},
			},
			overlay: {
				'[default]': {
					value: 'Purple850',
				},
				hovered: {
					value: 'Purple800',
				},
				pressed: {
					value: 'Purple700',
				},
			},
			container: {
				'[default]': {
					value: 'DarkNeutral100A',
				},
				hovered: {
					value: 'DarkNeutral200A',
				},
				pressed: {
					value: 'DarkNeutral250A',
				},
			},
		},
	},
};

export default elevation;
