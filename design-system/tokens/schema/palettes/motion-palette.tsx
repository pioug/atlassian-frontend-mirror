import type { MotionScaleTokenSchema } from '../../src/types';

/**
 * Types are inferred from the base tokens below
 */
export type MotionPaletteToken = {
	duration: BaseDurationToken;
	curve: BaseEasingToken;
	keyframes?: BaseKeyframeToken[];
	properties?: BaseTransitionPropertyToken[];
	delay?: BaseDurationToken;
} | BaseDurationToken | BaseEasingToken | BaseKeyframeToken;
export type BaseDurationToken = keyof typeof baseDurationTokens;
export type BaseEasingToken = keyof typeof baseBezierCurveTokens;
export type BaseKeyframeToken = keyof typeof baseKeyframeTokens;
export type BaseTransitionPropertyToken = keyof typeof baseTransitionPropertyTokens;

export type MotionTokenSchema = {
	motion: MotionScaleTokenSchema<
		BaseDurationToken,
		BaseEasingToken,
		BaseKeyframeToken,
		BaseTransitionPropertyToken
	>;
};

const baseTransitionPropertyTokens = {
	Transform: {
		value: 'transform',
		attributes: {
			group: 'motionProperty',
		},
	},
} as const;

const baseKeyframeTokens = {
	SlideInTop8px: {
		value: {
			'0%': { transform: 'translateY(8px)' },
			'100%': { transform: 'translateY(0px)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideInBottom8px: {
		value: {
			'0%': { transform: 'translateY(-8px)' },
			'100%': { transform: 'translateY(0px)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideInLeft8px: {
		value: {
			'0%': { transform: 'translateX(8px)' },
			'100%': { transform: 'translateX(0px)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideInRight8px: {
		value: {
			'0%': { transform: 'translateX(-8px)' },
			'100%': { transform: 'translateX(0px)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideOutTop8px: {
		value: {
			'0%': { transform: 'translateY(0px)' },
			'100%': { transform: 'translateY(4px)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideOutBottom8px: {
		value: {
			'0%': { transform: 'translateY(0px)' },
			'100%': { transform: 'translateY(-4px)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideOutLeft8px: {
		value: {
			'0%': { transform: 'translateX(0px)' },
			'100%': { transform: 'translateX(4px)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideOutRight8px: {
		value: {
			'0%': { transform: 'translateX(0px)' },
			'100%': { transform: 'translateX(-4px)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	ScaleIn80to100: {
		value: {
			'0%': { transform: 'scale(0.8)' },
			'100%': { transform: 'scale(1)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	ScaleIn95to100: {
		value: {
			'0%': { transform: 'scale(0.95)' },
			'100%': { transform: 'scale(1)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	ScaleOut100to80: {
		value: {
			'0%': { transform: 'scale(1)' },
			'100%': { transform: 'scale(0.8)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	ScaleOut100to95: {
		value: {
			'0%': { transform: 'scale(1)' },
			'100%': { transform: 'scale(0.95)' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	FadeIn0to100: {
		value: {
			'0%': { opacity: 0 },
			'100%': { opacity: 1 },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	FadeOut100to0: {
		value: {
			'0%': { opacity: 1 },
			'100%': { opacity: 0 },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideOut15PercentLeft: {
		value: {
			'0%': { transform: 'translateX(0px)', 'transform-origin': 'left' },
			'100%': { transform: 'translateX(-15%)', 'transform-origin': 'left' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
	SlideIn50PercentLeft: {
		value: {
			'0%': { transform: 'translateX(-50%)', 'transform-origin': 'left' },
			'100%': { transform: 'translateX(0px)', 'transform-origin': 'left' },
		},
		attributes: {
			group: 'motionKeyframe',
		},
	},
} as const;

const baseDurationTokens = {
	Duration000: {
		value: 0,
		attributes: {
			group: 'motionDuration',
		},
	},
	Duration050: {
		value: 50,
		attributes: {
			group: 'motionDuration',
		},
	},
	Duration100: {
		value: 100,
		attributes: {
			group: 'motionDuration',
		},
	},
	Duration150: {
		value: 150,
		attributes: {
			group: 'motionDuration',
		},
	},
	Duration200: {
		value: 200,
		attributes: {
			group: 'motionDuration',
		},
	},
	Duration250: {
		value: 250,
		attributes: {
			group: 'motionDuration',
		},
	},
	Duration400: {
		value: 400,
		attributes: {
			group: 'motionDuration',
		},
	},
	Duration600: {
		value: 600,
		attributes: {
			group: 'motionDuration',
		},
	},
} as const;

const baseBezierCurveTokens = {
	EasePracticalOut: {
		value: 'cubic-bezier(0.4, 1, 0.6, 1)',
		attributes: {
			group: 'motionEasing',
		},
	},
	EasePracticalIn: {
		value: 'cubic-bezier(0.6, 0, 0.8, 0.6)',
		attributes: {
			group: 'motionEasing',
		},
	},
	EaseBoldInOut: {
		value: 'cubic-bezier(0.4, 0, 0, 1)',
		attributes: {
			group: 'motionEasing',
		},
	},
	EaseBoldOut: {
		value: 'cubic-bezier(0, 0.4, 0, 1)',
		attributes: {
			group: 'motionEasing',
		},
	},
	EaseSpring: {
		value: 'linear(0, 0.021, 0.058, 0.107, 0.164, 0.227, 0.292, 0.359, 0.425, 0.49, 0.552, 0.61, 0.664, 0.714, 0.759, 0.8, 0.837, 0.869, 0.898, 0.922, 0.943, 0.961, 0.976, 0.988, 0.998, 1.006, 1.013, 1.017, 1.02, 1.023, 1.024, 1.024, 1.024, 1.024, 1.023, 1.022, 1.02, 1.019, 1.017, 1.015, 1.014, 1.012, 1.011, 1.009, 1.008, 1.007, 1.006, 1.005, 1.004, 1.003, 1.002, 1.002, 1.001, 1.001, 1.001, 1, 1, 1, 1, 1, 0.999, 0.999, 0.999, 0.999, 1)',
		attributes: {
			group: 'motionEasing',
		},
	}
} as const;

const motionPalette: MotionTokenSchema = {
	motion: {
		duration: baseDurationTokens,
		curve: baseBezierCurveTokens,
		keyframe: baseKeyframeTokens,
		properties: baseTransitionPropertyTokens,
	},
};

export default motionPalette;
