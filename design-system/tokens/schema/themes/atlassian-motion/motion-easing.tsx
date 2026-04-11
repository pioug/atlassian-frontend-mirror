import type { MotionEasingTokenSchema, ValueSchema } from '../../../src/types';
import type { BaseEasingToken } from '../../palettes/motion-palette';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/motion/motion.tsx'
 */
const motion: ValueSchema<MotionEasingTokenSchema<BaseEasingToken>> = {
	motion: {
		easing: {
			out: {
				bold: { value: 'EaseBoldOut' },
				practical: { value: 'EasePracticalOut' },
			},
			in: {
				practical: { value: 'EasePracticalIn' },
			},
			inout: {
				bold: { value: 'EaseBoldInOut' },
			},
			spring: {
				value: 'EaseSpring',
			},
		},
	},
};

export default motion;
