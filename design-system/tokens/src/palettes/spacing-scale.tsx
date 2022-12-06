import type { SpacingScaleTokenSchema } from '../types';

/**
 * Types are inferred from the base tokens below
 */
export type SpacingPaletteToken = keyof typeof baseSpacingTokens;

const baseSpacingTokens = {
  Space0: {
    value: '0',
    attributes: {
      group: 'scale',
    },
  },
  Space025: {
    value: '0.125rem',
    attributes: {
      group: 'scale',
    },
  },
  Space050: {
    value: '0.25rem',
    attributes: {
      group: 'scale',
    },
  },
  Space075: {
    value: '0.375rem',
    attributes: {
      group: 'scale',
    },
  },
  Space100: {
    value: '0.5rem',
    attributes: {
      group: 'scale',
    },
  },
  Space150: {
    value: '0.75rem',
    attributes: {
      group: 'scale',
    },
  },
  Space200: {
    value: '1rem',
    attributes: {
      group: 'scale',
    },
  },
  Space250: {
    value: '1.25rem',
    attributes: {
      group: 'scale',
    },
  },
  Space300: {
    value: '1.5rem',
    attributes: {
      group: 'scale',
    },
  },
  Space400: {
    value: '2rem',
    attributes: {
      group: 'scale',
    },
  },
  Space500: {
    value: '2.5rem',
    attributes: {
      group: 'scale',
    },
  },
  Space600: {
    value: '3rem',
    attributes: {
      group: 'scale',
    },
  },
  Space800: {
    value: '4rem',
    attributes: {
      group: 'scale',
    },
    pixelValue: '64px',
  },
  Space1000: {
    value: '5rem',
    attributes: {
      group: 'scale',
    },
    pixelValue: '80px',
  },
} as const;

const spacingPalette: SpacingScaleTokenSchema<SpacingPaletteToken> = {
  spacing: {
    scale: baseSpacingTokens,
  },
  space: baseSpacingTokens,
};

export default spacingPalette;
