import type { MotionTokenSchema, ValueSchema } from '../../../src/types';
import type { MotionPaletteToken } from '../../palettes/motion-palette';

/**
 * This is combined with the attribute schema.
 * @link 'file:../default/motion/motion.tsx'
 */
const motion: ValueSchema<MotionTokenSchema<MotionPaletteToken>> = {
	motion: {
		avatar: {
			enter: {
				value: {
					duration: 'Duration150',
					curve: 'EasePracticalOut',
					keyframes: ['ScaleIn80to100', 'FadeIn0to100'],
				},
			},
			exit: {
				value: {
					duration: 'Duration100',
					curve: 'EasePracticalIn',
					keyframes: ['ScaleOut100to80', 'FadeOut100to0'],
				},
			},
			hovered: {
				value: {
					duration: 'Duration250',
					curve: 'EaseSpring',
					properties: ['Transform'],
				},
			},
		},
		flag: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldOut',
					keyframes: ['SlideIn50PercentLeft', 'FadeIn0to100'],
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['SlideOut15PercentLeft', 'FadeOut100to0'],
				},
			},
			reposition: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldInOut',
					properties: ['Transform'],
				},
			},
		},
		modal: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldInOut',
					keyframes: ['ScaleIn95to100'],
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['ScaleOut100to95'],
				},
			},
		},
		blanket: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldInOut',
					keyframes: ['FadeIn0to100'],
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['FadeOut100to0'],
				},
			},
		},
		popup: {
			enter: {
				top: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInTop8px', 'FadeIn0to100'],
					},
				},
				bottom: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInBottom8px', 'FadeIn0to100'],
					},
				},
				left: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInLeft8px', 'FadeIn0to100'],
					},
				},
				right: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInRight8px', 'FadeIn0to100'],
					},
				},
			},
			exit: {
				top: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutTop8px', 'FadeOut100to0'],
					},
				},
				bottom: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutBottom8px', 'FadeOut100to0'],
					},
				},
				left: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutLeft8px', 'FadeOut100to0'],
					},
				},
				right: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutRight8px', 'FadeOut100to0'],
					},
				},
			},
		},
		spotlight: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldInOut',
					keyframes: ['ScaleIn95to100', 'FadeIn0to100'],
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['ScaleOut100to95', 'FadeOut100to0'],
				},
			},
		},
	},
};

export default motion;
