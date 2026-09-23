import type { MotionKeyframeTokenSchema, ValueSchema } from '../../../src/types';
import type { BaseKeyframeToken } from '../../palettes/motion-palette';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/motion/motion.tsx'
 */
const motion: ValueSchema<MotionKeyframeTokenSchema<BaseKeyframeToken>> = {
	motion: {
		keyframe: {
			grid: {
				column: {
					in: { value: 'GridColumnIn80to100' },
					out: { value: 'GridColumnOut100to0' },
				},
			},
			scale: {
				in: {
					small: { value: 'ScaleIn95to100' },
					medium: { value: 'ScaleIn80to100' },
				},
				out: {
					small: { value: 'ScaleOut100to95' },
					medium: { value: 'ScaleOut100to80' },
				},
			},
			fade: {
				in: { value: 'FadeIn0to100' },
				out: { value: 'FadeOut100to0' },
			},
			slide: {
				in: {
					top: {
						short: { value: 'SlideInTop8px' },
					},
					bottom: {
						short: { value: 'SlideInBottom8px' },
					},
					left: {
						short: { value: 'SlideInLeft8px' },
						half: { value: 'SlideIn50PercentLeft' },
					},
					right: {
						short: { value: 'SlideInRight8px' },
					},
				},
				out: {
					top: {
						short: { value: 'SlideOutTop4px' },
					},
					bottom: {
						short: { value: 'SlideOutBottom4px' },
					},
					left: {
						short: { value: 'SlideOutLeft4px' },
						half: { value: 'SlideOut15PercentLeft' },
					},
					right: {
						short: { value: 'SlideOutRight4px' },
					},
				},
			},
		},
	},
};

export default motion;
