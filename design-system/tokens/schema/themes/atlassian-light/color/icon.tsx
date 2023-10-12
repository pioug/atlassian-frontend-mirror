import type { IconColorTokenSchema, ValueSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ValueSchema<IconColorTokenSchema<BaseToken>> = {
  color: {
    icon: {
      '[default]': {
        value: 'Neutral800',
      },
      subtle: {
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
        value: 'Red600',
      },
      warning: {
        '[default]': {
          value: 'Orange600',
        },
        inverse: {
          value: 'Neutral1000',
        },
      },
      success: {
        value: 'Green600',
      },
      discovery: {
        value: 'Purple600',
      },
      information: {
        value: 'Blue600',
      },
    },
  },
};

export default color;
