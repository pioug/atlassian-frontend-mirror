import type { ShapeScaleTokenSchema } from '../../src/types';

/**
 * Types are inferred from the base tokens below
 */
export type ShapePaletteToken = BaseRadiusToken | BaseSizeToken;
export type BaseSizeToken = keyof typeof baseSizeTokens;
export type BaseRadiusToken = keyof typeof baseRadiusTokens;

const baseSizeTokens = {
	// deprecated
	Size0: {
		value: 0,
		attributes: {
			group: 'shape',
		},
	},
	// deprecated
	Size200: {
		value: 3,
		attributes: {
			group: 'shape',
		},
	},
	BorderWidth1: {
		value: 1,
		attributes: {
			group: 'shape',
		},
	},
	BorderWidth2: {
		value: 2,
		attributes: {
			group: 'shape',
		},
	},
} as const;

const baseRadiusTokens = {
	Radius02: {
		value: 2,
		attributes: {
			group: 'shape',
		},
	},
	Radius04: {
		value: 4,
		attributes: {
			group: 'shape',
		},
	},
	Radius06: {
		value: 6,
		attributes: {
			group: 'shape',
		},
	},
	Radius08: {
		value: 8,
		attributes: {
			group: 'shape',
		},
	},
	Radius12: {
		value: 12,
		attributes: {
			group: 'shape',
		},
	},
	Radius16: {
		value: 16,
		attributes: {
			group: 'shape',
		},
	},
	Radius20: {
		value: 20,
		attributes: {
			group: 'shape',
		},
	},
	Radius99: {
		value: 9999,
		attributes: {
			group: 'shape',
		},
	},
} as const;

const shapePalette: ShapeScaleTokenSchema<BaseRadiusToken, BaseSizeToken> = {
	border: {
		width: baseSizeTokens,
	},
	radius: baseRadiusTokens,
};

export default shapePalette;
