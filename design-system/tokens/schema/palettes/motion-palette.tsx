import type { MotionScaleTokenSchema } from '../../src/types';

/**
 * Types are inferred from the base tokens below
 */
export type MotionPaletteToken = {
	duration: BaseDurationToken;
	curve: BaseBezierCurveToken;
	keyframes: BaseKeyframeToken[];
	delay?: BaseDurationToken;
};
export type BaseDurationToken = keyof typeof baseDurationTokens;
export type BaseBezierCurveToken = keyof typeof baseBezierCurveTokens;
export type BaseKeyframeToken = keyof typeof baseKeyframeTokens;

export type MotionTokenSchema = {
	motion: MotionScaleTokenSchema<BaseDurationToken, BaseBezierCurveToken, BaseKeyframeToken>;
};
const baseKeyframeTokens = {
	ScaleIn80: {
		value: {
			'0%': { transform: 'scale(0.8)' },
			'100%': { transform: 'scale(1)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	ScaleIn85: {
		value: {
			'0%': { transform: 'scale(0.85)' },
			'100%': { transform: 'scale(1)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	ScaleIn90: {
		value: {
			'0%': { transform: 'scale(0.9)' },
			'100%': { transform: 'scale(1)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	ScaleIn95: {
		value: {
			'0%': { transform: 'scale(0.95)' },
			'100%': { transform: 'scale(1)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	ScaleOut80: {
		value: {
			'0%': { transform: 'scale(1)' },
			'100%': { transform: 'scale(0.8)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	ScaleOut85: {
		value: {
			'0%': { transform: 'scale(1)' },
			'100%': { transform: 'scale(0.85)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	ScaleOut90: {
		value: {
			'0%': { transform: 'scale(1)' },
			'100%': { transform: 'scale(0.9)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	ScaleOut95: {
		value: {
			'0%': { transform: 'scale(1)' },
			'100%': { transform: 'scale(0.95)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	FadeIn: {
		value: {
			'0%': { opacity: 0 },
			'100%': { opacity: 1 },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	FadeOut: {
		value: {
			'0%': { opacity: 1 },
			'100%': { opacity: 0 },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	RotateIn: {
		value: {
			'0%': { transform: 'rotate(0deg)' },
			'100%': { transform: 'rotate(5deg)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	RotateOut: {
		value: {
			'0%': { transform: 'rotate(5deg)' },
			'100%': { transform: 'rotate(0deg)' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
} as const;

const baseDurationTokens = {
	Duration050: {
		value: 50,
		attributes: {
			group: 'motion',
		},
	},
	Duration100: {
		value: 100,
		attributes: {
			group: 'motion',
		},
	},
	Duration150: {
		value: 150,
		attributes: {
			group: 'motion',
		},
	},
	Duration200: {
		value: 200,
		attributes: {
			group: 'motion',
		},
	},
	Duration250: {
		value: 250,
		attributes: {
			group: 'motion',
		},
	},
	Duration300: {
		value: 300,
		attributes: {
			group: 'motion',
		},
	},
	Duration350: {
		value: 350,
		attributes: {
			group: 'motion',
		},
	},
	Duration400: {
		value: 400,
		attributes: {
			group: 'motion',
		},
	},
} as const;

const baseBezierCurveTokens = {
	CubicEaseOut: {
		value: 'cubic-bezier(0.33, 1, 0.68, 1)',
		attributes: {
			group: 'motion',
		},
	},
	CubicEaseIn: {
		value: 'cubic-bezier(0.32, 0, 0.67, 0)',
		attributes: {
			group: 'motion',
		},
	},
	CubicEaseInOut: {
		value: 'cubic-bezier(0.66, 0, 0.34, 1)',
		attributes: {
			group: 'motion',
		},
	},
} as const;

const motionPalette: MotionTokenSchema = {
	motion: {
		duration: baseDurationTokens,
		curve: baseBezierCurveTokens,
		keyframe: baseKeyframeTokens,
	},
};

export default motionPalette;
