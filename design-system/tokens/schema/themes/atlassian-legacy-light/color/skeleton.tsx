import type { SkeletonColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/legacy-palette';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
	color: {
		skeleton: {
			'[default]': { value: 'N20' },
			subtle: { value: 'N20A' },
		},
	},
};

export default color;
