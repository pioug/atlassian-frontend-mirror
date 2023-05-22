import type { BaseToken } from '../../../palettes/palette';
import type { ExtendedValueSchema, TextColorTokenSchema } from '../../../types';

const color: ExtendedValueSchema<TextColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      '[default]': {
        value: 'DarkNeutral900',
      },
      subtlest: {
        // @ts-ignore new value for DarkNeautral700
        value: '#8C9BAB',
      },
      inverse: {
        value: 'DarkNeutral100',
      },
      warning: {
        inverse: {
          value: 'DarkNeutral100',
        },
      },
    },
  },
};

export default color;
