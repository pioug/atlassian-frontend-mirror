import type { TextColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';
import { dynamicColor } from '../_formulas';

const color: ValueSchema<TextColorTokenSchema<BaseToken>> = {
	color: {
		text: {
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
				'[default]': {
					value: dynamicColor.foreground,
				},
				bolder: {
					value: dynamicColor.foreground,
				},
			},
			warning: {
				'[default]': {
					value: dynamicColor.foreground,
				},
				inverse: {
					value: dynamicColor.background,
				},
				bolder: {
					value: dynamicColor.foreground,
				},
			},
			success: {
				'[default]': {
					value: dynamicColor.foreground,
				},
				bolder: {
					value: dynamicColor.foreground,
				},
			},
			information: {
				'[default]': {
					value: dynamicColor.foreground,
				},
				bolder: {
					value: dynamicColor.foreground,
				},
			},
			discovery: {
				'[default]': {
					value: dynamicColor.foreground,
				},
				bolder: {
					value: dynamicColor.foreground,
				},
			},
		},
		link: {
			'[default]': {
				value: dynamicColor.foreground,
			},
			pressed: {
				value: dynamicColor.foregroundPressed,
			},
			visited: {
				'[default]': {
					value: dynamicColor.foreground,
				},
				pressed: {
					value: dynamicColor.foregroundPressed,
				},
			},
		},
	},
};

export default color;
