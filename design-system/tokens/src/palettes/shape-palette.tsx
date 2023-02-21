import type { ShapeScaleTokenSchema } from '../types';

/**
 * Types are inferred from the base tokens below
 */
export type ShapePaletteToken = BaseRadiusToken | BaseSizeToken;
export type BaseSizeToken = keyof typeof baseSizeTokens;
export type BaseRadiusToken = keyof typeof baseRadiusTokens;

const baseSizeTokens = {
  Size050: {
    value: '0.0625rem',
    attributes: {
      group: 'shape',
    },
  },
  Size100: {
    value: '0.125rem',
    attributes: {
      group: 'shape',
    },
  },
} as const;

const baseRadiusTokens = {
  Radius050: {
    value: '0.125rem',
    attributes: {
      group: 'shape',
    },
  },
  Radius100: {
    value: '0.25rem',
    attributes: {
      group: 'shape',
    },
  },
  Radius200: {
    value: '0.5rem',
    attributes: {
      group: 'shape',
    },
  },
  Radius300: {
    value: '0.75rem',
    attributes: {
      group: 'shape',
    },
  },
  Radius400: {
    value: '1rem',
    attributes: {
      group: 'shape',
    },
  },
  RadiusCircle: {
    value: '50%',
    attributes: {
      group: 'shape',
    },
  },
} as const;

const shapePalette: ShapeScaleTokenSchema<BaseRadiusToken, BaseSizeToken> = {
  border: {
    radius: baseRadiusTokens,
    width: baseSizeTokens,
  },
};

export default shapePalette;
