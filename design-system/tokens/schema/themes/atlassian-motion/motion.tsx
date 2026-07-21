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
					fill: 'AnimationFillModeBackwards',
				},
			},
			exit: {
				value: {
					duration: 'Duration100',
					curve: 'EasePracticalIn',
					keyframes: ['ScaleOut100to80', 'FadeOut100to0'],
					fill: 'AnimationFillModeForwards',
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
		button: {
			hovered: {
				value: {
					duration: 'Duration150',
					curve: 'EasePracticalOut',
					properties: ['BackgroundColor'],
				},
			},
			pressed: {
				value: {
					duration: 'Duration150',
					curve: 'EasePracticalOut',
					properties: ['BackgroundColor'],
				},
			},
		},
		listitem: {
			hovered: {
				value: {
					duration: 'Duration050',
					curve: 'EasePracticalOut',
					properties: ['BackgroundColor', 'BorderColor', 'Color', 'TextDecorationColor'],
				},
			},
			pressed: {
				value: {
					duration: 'Duration100',
					curve: 'EasePracticalOut',
					properties: ['BackgroundColor', 'BorderColor', 'Color', 'TextDecorationColor'],
				},
			},
			selected: {
				value: {
					duration: 'Duration100',
					curve: 'EasePracticalOut',
					properties: ['BackgroundColor', 'BorderColor', 'Color', 'TextDecorationColor'],
				},
			},
		},
		flag: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldOut',
					keyframes: ['SlideIn50PercentLeft', 'FadeIn0to100'],
					fill: 'AnimationFillModeBackwards',
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['SlideOut15PercentLeft', 'FadeOut100to0'],
					fill: 'AnimationFillModeForwards',
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
					fill: 'AnimationFillModeBackwards',
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['ScaleOut100to95'],
					fill: 'AnimationFillModeForwards',
				},
			},
		},
		blanket: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldInOut',
					keyframes: ['FadeIn0to100'],
					fill: 'AnimationFillModeBackwards',
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['FadeOut100to0'],
					fill: 'AnimationFillModeForwards',
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
						fill: 'AnimationFillModeBackwards',
					},
				},
				bottom: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInBottom8px', 'FadeIn0to100'],
						fill: 'AnimationFillModeBackwards',
					},
				},
				left: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInLeft8px', 'FadeIn0to100'],
						fill: 'AnimationFillModeBackwards',
					},
				},
				right: {
					value: {
						duration: 'Duration150',
						curve: 'EasePracticalOut',
						keyframes: ['SlideInRight8px', 'FadeIn0to100'],
						fill: 'AnimationFillModeBackwards',
					},
				},
			},
			exit: {
				top: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutTop8px', 'FadeOut100to0'],
						fill: 'AnimationFillModeForwards',
					},
				},
				bottom: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutBottom8px', 'FadeOut100to0'],
						fill: 'AnimationFillModeForwards',
					},
				},
				left: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutLeft8px', 'FadeOut100to0'],
						fill: 'AnimationFillModeForwards',
					},
				},
				right: {
					value: {
						duration: 'Duration100',
						curve: 'EasePracticalIn',
						keyframes: ['SlideOutRight8px', 'FadeOut100to0'],
						fill: 'AnimationFillModeForwards',
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
					fill: 'AnimationFillModeBackwards',
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['ScaleOut100to95', 'FadeOut100to0'],
					fill: 'AnimationFillModeForwards',
				},
			},
		},
		panel: {
			enter: {
				value: {
					duration: 'Duration250',
					curve: 'EaseBoldOut',
					keyframes: ['SlideIn100PercentRight'],
					fill: 'AnimationFillModeBackwards',
				},
			},
			exit: {
				value: {
					duration: 'Duration200',
					curve: 'EasePracticalIn',
					keyframes: ['SlideOut100PercentRight'],
					fill: 'AnimationFillModeForwards',
				},
			},
		},
	},
};

export default motion;
