import type { SurfaceTokenSchema, ValueSchema } from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
	elevation: {
		surface: {
			'[default]': {
				'[default]': {
					value: 'Purple100',
				},
				hovered: {
					value: 'Purple300',
				},
				pressed: {
					value: 'Purple400',
				},
			},
			sunken: {
				value: 'Purple200',
			},
			raised: {
				'[default]': {
					value: 'Purple100',
				},
				hovered: {
					value: 'Purple300',
				},
				pressed: {
					value: 'Purple400',
				},
			},
			overlay: {
				'[default]': {
					value: 'Purple100',
				},
				hovered: {
					value: 'Purple300',
				},
				pressed: {
					value: 'Purple400',
				},
			},
			container: {
				'[default]': {
					value: 'Neutral100A',
				},
				hovered: {
					value: 'Neutral200A',
				},
				pressed: {
					value: 'Neutral300A',
				},
			},
		},
	},
};

export default elevation;
