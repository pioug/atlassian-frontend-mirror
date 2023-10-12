import type { ShapeScaleTokenSchema } from '../../src/types';

/**
 * Types are inferred from the base tokens below
 */
export type ShapePaletteToken = BaseRadiusToken | BaseSizeToken;
export type BaseSizeToken = keyof typeof baseSizeTokens;
export type BaseRadiusToken = keyof typeof baseRadiusTokens;

const baseSizeTokens = {
  Size0: {
    value: 0,
    attributes: {
      group: 'shape',
    },
  },
  Size050: {
    value: 1,
    attributes: {
      group: 'shape',
    },
  },
  Size100: {
    value: 2,
    attributes: {
      group: 'shape',
    },
  },
  Size200: {
    value: 3,
    attributes: {
      group: 'shape',
    },
  },
} as const;

const baseRadiusTokens = {
  Radius050: {
    value: 2,
    attributes: {
      group: 'shape',
    },
  },
  Radius100: {
    value: 4,
    attributes: {
      group: 'shape',
    },
  },
  Radius200: {
    value: 8,
    attributes: {
      group: 'shape',
    },
  },
  Radius300: {
    value: 12,
    attributes: {
      group: 'shape',
    },
  },
  Radius400: {
    value: 16,
    attributes: {
      group: 'shape',
    },
  },
  RadiusCircle: {
    // The year atlassian was founded in rem
    value: 32032,
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
