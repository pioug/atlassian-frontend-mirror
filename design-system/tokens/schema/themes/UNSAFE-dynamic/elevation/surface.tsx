import type { SurfaceTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';
import { dynamicColor } from '../_formulas';

const elevation: ValueSchema<SurfaceTokenSchema<BaseToken>> = {
	elevation: {
		surface: {
			'[default]': {
				'[default]': {
					value: dynamicColor.background,
				},
				hovered: {
					value: dynamicColor.backgroundHovered,
				},
				pressed: {
					value: dynamicColor.backgroundPressed,
				},
			},
			sunken: {
				value: dynamicColor.backgroundSubtle,
			},
			raised: {
				'[default]': {
					value: dynamicColor.background,
				},
				hovered: {
					value: dynamicColor.backgroundHovered,
				},
				pressed: {
					value: dynamicColor.backgroundPressed,
				},
			},
			overlay: {
				'[default]': {
					value: dynamicColor.background,
				},
				hovered: {
					value: dynamicColor.backgroundHovered,
				},
				pressed: {
					value: dynamicColor.backgroundPressed,
				},
			},
			container: {
				'[default]': {
					value: dynamicColor.background,
				},
				hovered: {
					value: dynamicColor.backgroundHovered,
				},
				pressed: {
					value: dynamicColor.backgroundPressed,
				},
			},
		},
	},
};

export default elevation;
