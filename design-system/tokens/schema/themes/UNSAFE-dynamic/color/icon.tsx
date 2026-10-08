import type { IconColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';
import { dynamicColor } from '../_formulas';

const color: ValueSchema<IconColorTokenSchema<BaseToken>> = {
	color: {
		icon: {
			'[default]': {
				value: dynamicColor.foreground,
			},
			subtle: {
				value: dynamicColor.foregroundSubtle,
			},
			subtlest: {
				value: dynamicColor.foregroundSubtlest,
			},
			inverse: {
				value: dynamicColor.background,
			},
			disabled: {
				value: dynamicColor.disabled,
			},
			brand: {
				value: dynamicColor.foreground,
			},
			selected: {
				value: dynamicColor.foreground,
			},
			danger: {
				value: dynamicColor.foreground,
			},
			warning: {
				'[default]': {
					value: dynamicColor.foreground,
				},
				inverse: {
					value: dynamicColor.background,
				},
			},
			success: {
				value: dynamicColor.foreground,
			},
			discovery: {
				value: dynamicColor.foreground,
			},
			information: {
				value: dynamicColor.foreground,
			},
		},
	},
};

export default color;
