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
      selected: {
        // @ts-ignore Blue350 not currently available
        value: '#6EAAFF',
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
