import type { SkeletonColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';
import { dynamicColor } from '../_formulas';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
	color: {
		skeleton: {
			'[default]': {
				value: dynamicColor.disabled,
			},
			subtle: {
				value: dynamicColor.disabled,
			},
		},
	},
};

export default color;
