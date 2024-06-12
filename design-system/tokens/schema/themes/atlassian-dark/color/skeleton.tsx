import type { SkeletonColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
	color: {
		skeleton: {
			'[default]': {
				value: 'DarkNeutral200A',
			},
			subtle: {
				value: 'DarkNeutral100A',
			},
		},
	},
};

export default color;
