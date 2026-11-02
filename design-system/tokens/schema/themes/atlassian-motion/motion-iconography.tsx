import type { MotionIconographyTokenSchema, ValueSchema } from '../../../src/types';
import type { MotionPaletteToken } from '../../palettes/motion-palette';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/motion/motion.tsx'
 */
const motion: ValueSchema<MotionIconographyTokenSchema<MotionPaletteToken>> = {
	motion: {
		iconography: {
			enter: {
				fade: {
					value: {
						duration: 'Duration250',
						curve: 'EaseBoldOut',
						keyframes: ['FadeIn0to100'],
						fill: 'AnimationFillModeBackwards',
					},
				},
				cycle: {
					up: {
						value: {
							duration: 'Duration400',
							curve: 'EaseCubicInOut',
							keyframes: ['SlideIn100PercentBottom'],
							fill: 'AnimationFillModeBackwards',
						},
					},
				},
			},
			exit: {
				fade: {
					value: {
						duration: 'Duration250',
						curve: 'EasePracticalIn',
						keyframes: ['FadeOut100to0'],
						fill: 'AnimationFillModeForwards',
					},
				},
				cycle: {
					up: {
						value: {
							duration: 'Duration400',
							curve: 'EaseCubicInOut',
							keyframes: ['SlideOut100PercentTop'],
							fill: 'AnimationFillModeForwards',
						},
					},
				},
			},
		},
	},
};

export default motion;
