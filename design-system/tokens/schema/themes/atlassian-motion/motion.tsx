import type { MotionTokenSchema, ValueSchema } from '../../../src/types';
import type { MotionPaletteToken } from '../../palettes/motion-palette';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/motion/motion.tsx'
 */
const motion: ValueSchema<MotionTokenSchema<MotionPaletteToken>> = {
	motion: {
		dialog: {
			enter: {
				value: {
					// This can be whatever I want
					duration: 'Duration350',
					curve: 'CubicEaseInOut',
					keyframes: ['ScaleIn80', 'FadeIn'],
				},
			},
			exit: {
				value: {
					duration: 'Duration350',
					curve: 'CubicEaseInOut',
					keyframes: ['ScaleOut80', 'FadeOut'],
				},
			},
		},
		content: {
			enter: {
				short: {
					value: {
						duration: 'Duration100',
						curve: 'CubicEaseInOut',
						keyframes: ['FadeIn'],
					},
				},
				medium: {
					value: {
						duration: 'Duration200',
						curve: 'CubicEaseInOut',
						keyframes: ['FadeIn'],
					},
				},
				long: {
					value: {
						duration: 'Duration400',
						curve: 'CubicEaseInOut',
						keyframes: ['FadeIn'],
					},
				},
			},
			exit: {
				short: {
					value: {
						duration: 'Duration050',
						curve: 'CubicEaseInOut',
						keyframes: ['FadeOut'],
					},
				},
				medium: {
					value: {
						duration: 'Duration100',
						curve: 'CubicEaseInOut',
						keyframes: ['FadeOut'],
					},
				},
				long: {
					value: {
						duration: 'Duration200',
						curve: 'CubicEaseInOut',
						keyframes: ['FadeOut'],
					},
				},
			},
		},
	},
};

export default motion;
