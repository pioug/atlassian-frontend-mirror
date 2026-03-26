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
					curve: 'EasePracticalIn',
					keyframes: ['ScaleIn80', 'FadeIn'],
				},
			},
			exit: {
				value: {
					duration: 'Duration100',
					curve: 'Custom',
					keyframes: ['ScaleOut80', 'FadeOut'],
				},
			},
			hovered: {
				value: {
					duration: 'Duration100',
					curve: 'Custom',
					properties: ['Transform'],
				},
			},
		},
		flag: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldOut',
					keyframes: ['SlideIn50PercentLeft', 'FadeIn'],
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['SlideOut15PercentLeft', 'FadeOut'],
				},
			},
			reposition: {
				value: {
					duration: 'Duration300',
					curve: 'EaseBoldInOut',
					properties: ['Transform'],
				},
			},
		},
		modal: {
			enter: {
				value: {
					duration: 'Duration200',
					curve: 'EaseBoldInOut',
					keyframes: ['ScaleIn95', 'FadeIn'],
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalOut',
					keyframes: ['ScaleOut95', 'FadeOut'],
				},
			},
		},
		popup: {
			enter: {
				top: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInTop', 'FadeIn'],
					},
				},
				bottom: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInBottom', 'FadeIn'],
					},
				},
				left: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInLeft', 'FadeIn'],
					},
				},
				right: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInRight', 'FadeIn'],
					},
				},
			},
			exit: {
				top: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutTop', 'FadeOut'],
					},
				},
				bottom: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutBottom', 'FadeOut'],
					},
				},
				left: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutLeft', 'FadeOut'],
					},
				},
				right: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutRight', 'FadeOut'],
					},
				},
			},
		},
		spotlight: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldInOut',
					keyframes: ['ScaleIn95', 'FadeIn'],
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalOut',
					keyframes: ['ScaleOut95', 'FadeOut'],
				},
			},
		},
		content: {
			enter: {
				short: {
					value: {
						duration: 'Duration100',
						curve: 'EaseBoldInOut',
						keyframes: ['FadeIn'],
					},
				},
				medium: {
					value: {
						duration: 'Duration200',
						curve: 'EaseBoldInOut',
						keyframes: ['FadeIn'],
					},
				},
				long: {
					value: {
						duration: 'Duration400',
						curve: 'EaseBoldInOut',
						keyframes: ['FadeIn'],
					},
				},
			},
			exit: {
				short: {
					value: {
						duration: 'Duration050',
						curve: 'EaseBoldInOut',
						keyframes: ['FadeOut'],
					},
				},
				medium: {
					value: {
						duration: 'Duration100',
						curve: 'EaseBoldInOut',
						keyframes: ['FadeOut'],
					},
				},
				long: {
					value: {
						duration: 'Duration200',
						curve: 'EaseBoldInOut',
						keyframes: ['FadeOut'],
					},
				},
			},
		},
	},
};

export default motion;
