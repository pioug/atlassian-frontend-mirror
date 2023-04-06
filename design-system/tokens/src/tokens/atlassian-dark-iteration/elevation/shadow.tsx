import type { BaseToken } from '../../../palettes/palette';
import type { ExtendedValueSchema, ShadowTokenSchema } from '../../../types';

const shadow: ExtendedValueSchema<ShadowTokenSchema<BaseToken>> = {
  elevation: {
    shadow: {
      overlay: {
        value: [
          {
            radius: 0,
            spread: 1,
            color: 'DarkNeutral100A',
            offset: { x: 0, y: 0 },
            opacity: 0.12,
            inset: true,
          },
          {
            radius: 12,
            offset: { x: 0, y: 8 },
            color: 'DarkNeutral-100A',
            // This opacity overrides the color alpha.
            opacity: 0.36,
          },
          {
            radius: 1,
            offset: { x: 0, y: 0 },
            color: 'DarkNeutral-100A',
            // This opacity overrides the color alpha.
            opacity: 0.5,
          },
        ],
      },
    },
  },
};

export default shadow;
