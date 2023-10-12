import type { SpacingScaleTokenSchema } from '../../src/types';

/**
 * Types are inferred from the base tokens below
 */
export type SpacingPaletteToken = keyof typeof baseSpacingTokens;

const baseSpacingTokens = {
  Space0: {
    value: 0,
    attributes: {
      group: 'spacing',
    },
  },
  Space025: {
    value: 2,
    attributes: {
      group: 'spacing',
    },
  },
  Space050: {
    value: 4,
    attributes: {
      group: 'spacing',
    },
  },
  Space075: {
    value: 6,
    attributes: {
      group: 'spacing',
    },
  },
  Space100: {
    value: 8,
    attributes: {
      group: 'spacing',
    },
  },
  Space150: {
    value: 12,
    attributes: {
      group: 'spacing',
    },
  },
  Space200: {
    value: 16,
    attributes: {
      group: 'spacing',
    },
  },
  Space250: {
    value: 20,
    attributes: {
      group: 'spacing',
    },
  },
  Space300: {
    value: 24,
    attributes: {
      group: 'spacing',
    },
  },
  Space400: {
    value: 32,
    attributes: {
      group: 'spacing',
    },
  },
  Space500: {
    value: 40,
    attributes: {
      group: 'spacing',
    },
  },
  Space600: {
    value: 48,
    attributes: {
      group: 'spacing',
    },
  },
  Space800: {
    value: 64,
    attributes: {
      group: 'spacing',
    },
  },
  Space1000: {
    value: 80,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative025: {
    value: -2,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative050: {
    value: -4,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative075: {
    value: -6,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative100: {
    value: -8,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative150: {
    value: -12,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative200: {
    value: -16,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative250: {
    value: -20,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative300: {
    value: -24,
    attributes: {
      group: 'spacing',
    },
  },
  SpaceNegative400: {
    value: -32,
    attributes: {
      group: 'spacing',
    },
  },
} as const;

const spacingPalette: SpacingScaleTokenSchema<SpacingPaletteToken> = {
  space: baseSpacingTokens,
};

export default spacingPalette;
