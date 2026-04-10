import type { MotionDurationTokenSchema, ValueSchema } from '../../../src/types';
import type { BaseDurationToken } from '../../palettes/motion-palette';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/motion/motion.tsx'
 */
const motion: ValueSchema<MotionDurationTokenSchema<BaseDurationToken>> = {
	motion: {
		duration: {
			instant: { value: 'Duration000' },
			xxshort: { value: 'Duration050' },
			xshort: { value: 'Duration100' },
			short: { value: 'Duration150' },
			medium: { value: 'Duration200' },
			long: { value: 'Duration250' },
			xlong: { value: 'Duration400' },
			xxlong: { value: 'Duration600' },
		},
	},
};

export default motion;
