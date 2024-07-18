import type { SurfaceTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
	elevation: {
		surface: {
			'[default]': {
				'[default]': {
					value: 'Neutral0',
				},
				hovered: {
					value: 'Neutral200',
				},
				pressed: {
					value: 'Neutral300',
				},
			},
			sunken: {
				value: 'Neutral100',
			},
			raised: {
				'[default]': {
					value: 'Neutral0',
				},
				hovered: {
					value: 'Neutral200',
				},
				pressed: {
					value: 'Neutral300',
				},
			},
			overlay: {
				'[default]': {
					value: 'Neutral0',
				},
				hovered: {
					value: 'Neutral200',
				},
				pressed: {
					value: 'Neutral300',
				},
			},
		},
	},
};

export default elevation;
