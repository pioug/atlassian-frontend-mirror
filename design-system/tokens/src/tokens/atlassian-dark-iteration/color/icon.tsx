import type { BaseToken } from '../../../palettes/palette';
import type { ExtendedValueSchema, IconColorTokenSchema } from '../../../types';

const color: ExtendedValueSchema<IconColorTokenSchema<BaseToken>> = {
  color: {
    icon: {
      subtle: {
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
