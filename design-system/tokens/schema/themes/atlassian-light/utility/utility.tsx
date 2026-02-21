import type { UtilTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken, PaletteValues } from '../../../palettes/palette';
import elevation from '../elevation/surface';

const utility: ValueSchema<UtilTokenSchema<BaseToken>> = {
	UNSAFE: {
		transparent: {
			value: 'transparent',
		},
	},
	elevation: {
		surface: {
			current: {
				value: elevation.elevation.surface['[default]']['[default]'].value,
			},
		},
	},
};

// eslint-disable-next-line import/no-anonymous-default-export
const _default_1: {
	utility: ValueSchema<UtilTokenSchema<PaletteValues>>;
} = { utility };
export default _default_1;
