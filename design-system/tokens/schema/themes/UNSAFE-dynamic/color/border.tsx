import type { BorderColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';
import { dynamicColor } from '../_formulas';

const color: ValueSchema<BorderColorTokenSchema<BaseToken>> = {
	color: {
		border: {
			'[default]': {
				value: dynamicColor.borderSubtle,
			},
			bold: {
				value: dynamicColor.foreground,
			},
			inverse: {
				value: dynamicColor.background,
			},
			focused: {
				value: dynamicColor.foreground,
			},
			input: {
				'[default]': { value: dynamicColor.foreground },
				search: { value: dynamicColor.borderSubtle },
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
				'[default]': { value: dynamicColor.foreground },
				subtle: { value: dynamicColor.borderSubtle },
			},
			warning: {
				'[default]': { value: dynamicColor.foreground },
				subtle: { value: dynamicColor.borderSubtle },
			},
			success: {
				'[default]': { value: dynamicColor.foreground },
				subtle: { value: dynamicColor.borderSubtle },
			},
			discovery: {
				'[default]': { value: dynamicColor.foreground },
				subtle: { value: dynamicColor.borderSubtle },
			},
			information: {
				'[default]': { value: dynamicColor.foreground },
				subtle: { value: dynamicColor.borderSubtle },
			},
		},
	},
};

export default color;
