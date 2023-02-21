import type { SpacingScaleTokenSchema } from '../types';

/**
 * Types are inferred from the base tokens below
 */
export type SpacingPaletteToken = keyof typeof baseSpacingTokens;

const baseSpacingTokens = {
  Space0: {
    value: '0',
    attributes: {
      group: 'spacing',
    },
  },
  Space025: {
    value: '0.125rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space050: {
    value: '0.25rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space075: {
    value: '0.375rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space100: {
    value: '0.5rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space150: {
    value: '0.75rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space200: {
    value: '1rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space250: {
    value: '1.25rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space300: {
    value: '1.5rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space400: {
    value: '2rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space500: {
    value: '2.5rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space600: {
    value: '3rem',
    attributes: {
      group: 'spacing',
    },
  },
  Space800: {
    value: '4rem',
    attributes: {
      group: 'spacing',
    },
    pixelValue: '64px',
  },
  Space1000: {
    value: '5rem',
    attributes: {
      group: 'spacing',
    },
    pixelValue: '80px',
  },
} as const;

const spacingPalette: SpacingScaleTokenSchema<SpacingPaletteToken> = {
  space: baseSpacingTokens,
};

export default spacingPalette;
