import type { MotionScaleTokenSchema } from '../../src/types';

/**
 * Types are inferred from the base tokens below
 */
export type MotionPaletteToken = {
	duration: BaseDurationToken;
	curve: BaseBezierCurveToken;
	keyframes?: BaseKeyframeToken[];
	properties?: BaseTransitionPropertyToken[];
	delay?: BaseDurationToken;
};
export type BaseDurationToken = keyof typeof baseDurationTokens;
export type BaseBezierCurveToken = keyof typeof baseBezierCurveTokens;
export type BaseKeyframeToken = keyof typeof baseKeyframeTokens;
export type BaseTransitionPropertyToken = keyof typeof baseTransitionPropertyTokens;

export type MotionTokenSchema = {
	motion: MotionScaleTokenSchema<BaseDurationToken, BaseBezierCurveToken, BaseKeyframeToken, BaseTransitionPropertyToken>;
};

const baseTransitionPropertyTokens = {
	Transform: {
		value: 'transform',
		attributes: {
			group: 'motion',
		},
	},
} as const;

const baseKeyframeTokens = {
	SlideInTop: {
		value: {
			'0%': { transform: 'translateY(8px)' },
			'100%': { transform: 'translateY(0px)' },
		},
		attributes: {
			group: 'keyframe',
		}
	},
	SlideInBottom: {
		value: {
			'0%': { transform: 'translateY(-8px)' },
			'100%': { transform: 'translateY(0px)' },
		},
		attributes: {
			group: 'keyframe',
		}
	},
	SlideInLeft: {
		value: {
			'0%': { transform: 'translateX(8px)' },
			'100%': { transform: 'translateX(0px)' },
		},
		attributes: {
			group: 'keyframe',
		}
	},
	SlideInRight: {
		value: {
			'0%': { transform: 'translateX(-8px)' },
			'100%': { transform: 'translateX(0px)' },
		},
		attributes: {
			group: 'keyframe',
		}
	},
	SlideOutTop: {
		value: {
			'0%': { transform: 'translateY(0px)' },
			'100%': { transform: 'translateY(4px)' },
		},
		attributes: {
			group: 'keyframe',
		}
	},
	SlideOutBottom: {
		value: {
			'0%': { transform: 'translateY(0px)' },
			'100%': { transform: 'translateY(-4px)' },
		},
		attributes: {
			group: 'keyframe',
		}
	},
	SlideOutLeft: {
		value: {
			'0%': { transform: 'translateX(0px)' },
			'100%': { transform: 'translateX(4px)' },
		},
		attributes: {
			group: 'keyframe',
		}
	},
	SlideOutRight: {
		value: {
			'0%': { transform: 'translateX(0px)' },
			'100%': { transform: 'translateX(-4px)' },
		},
		attributes: {
			group: 'keyframe',
		}
	},
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
	SlideIn15PercentLeft: {
		value: {
			'0%': { transform: 'translateX(-15%)', 'transform-origin': 'left' },
			'100%': { transform: 'translateX(0px)', 'transform-origin': 'left' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	SlideOut15PercentLeft: {
		value: {
			'0%': { transform: 'translateX(0px)', 'transform-origin': 'left' },
			'100%': { transform: 'translateX(-15%)', 'transform-origin': 'left' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	SlideIn50PercentLeft: {
		value: {
			'0%': { transform: 'translateX(-50%)', 'transform-origin': 'left' },
			'100%': { transform: 'translateX(0px)', 'transform-origin': 'left' },
		},
		attributes: {
			group: 'keyframe',
		},
	},
	SlideOut50PercentLeft: {
		value: {
			'0%': { transform: 'translateX(0px)', 'transform-origin': 'left' },
			'100%': { transform: 'translateX(-50%)', 'transform-origin': 'left' },
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
	EasePracticalOut: {
		value: 'cubic-bezier(0.4, 1, 0.6, 1)',
		attributes: {
			group: 'motion',
		},
	},
	EasePracticalIn: {
		value: 'cubic-bezier(0.6, 0, 0.8, 0.6)',
		attributes: {
			group: 'motion',
		},
	},
	EaseBoldInOut: {
		value: 'cubic-bezier(0.4, 0, 0, 1)',
		attributes: {
			group: 'motion',
		},
	},
	EaseBoldOut: {
		value: 'cubic-bezier(0, 0.4, 0, 1)',
		attributes: {
			group: 'motion',
		},
	},
	Custom: {
		value: 'cubic-bezier(0.32, 0, 0.67, 0)',
		attributes: {
			group: 'motion',
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
