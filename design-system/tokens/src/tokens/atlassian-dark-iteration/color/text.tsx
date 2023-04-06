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
    link: {
      '[default]': {
        // @ts-ignore Blue350 not currently available
        value: '#6EAAFF',
      },
      pressed: {
        // @ts-ignore Blue250 not currently available
        value: '#A8CCFF',
      },
    },
  },
};

export default color;
