import type { SkeletonColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
	color: {
		skeleton: {
			'[default]': {
				value: 'Neutral200A',
			},
			subtle: {
				value: 'Neutral100A',
			},
		},
	},
};

export default color;
