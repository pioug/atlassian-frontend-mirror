import type { AttributeSchema, SkeletonColorTokenSchema } from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const color: AttributeSchema<SkeletonColorTokenSchema<BaseToken>> = {
	color: {
		skeleton: {
			'[default]': {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.8.0',
					description: 'Use for skeleton loading states',
				},
			},
			subtle: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.8.0',
					description: 'Use for the pulse or shimmer effect in skeleton loading states',
				},
			},
		},
	},
};

export default color;
