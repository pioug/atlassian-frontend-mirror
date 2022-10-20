import type { BaseToken } from '../../../palettes/palette';
import type { TextColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<TextColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      '[default]': {
        value: 'Neutral1000',
      },
      subtle: {
        value: 'Neutral800',
      },
      subtlest: {
        value: 'Neutral700',
      },
      inverse: {
        value: 'Neutral0',
      },
      disabled: {
        value: 'Neutral400A',
      },
      brand: {
        value: 'Blue700',
      },
      selected: {
        value: 'Blue700',
      },
      danger: {
        value: 'Red800',
      },
      warning: {
        '[default]': {
          value: 'Orange800',
        },
        inverse: {
          value: 'Neutral1000',
        },
      },
      success: {
        value: 'Green800',
      },
      information: {
        value: 'Blue800',
      },
      discovery: {
        value: 'Purple800',
      },
    },
    link: {
      '[default]': {
        value: 'Blue700',
      },
      pressed: {
        value: 'Blue800',
      },
    },
  },
};

export default color;
