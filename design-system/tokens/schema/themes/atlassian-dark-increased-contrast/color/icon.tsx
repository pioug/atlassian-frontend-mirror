import type {
  ExtendedValueSchema,
  IconColorTokenSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<IconColorTokenSchema<BaseToken>> = {
  color: {
    icon: {
      '[default]': {
        value: 'DarkNeutral1000',
      },
      subtle: {
        value: 'DarkNeutral900',
      },
      brand: {
        value: 'Blue300',
      },
      selected: {
        value: 'Blue300',
      },
      danger: {
        value: 'Red400',
      },
      warning: {
        '[default]': {
          value: 'Orange300',
        },
        inverse: {
          value: 'DarkNeutral0',
        },
      },
      success: {
        value: 'Green300',
      },
      discovery: {
        value: 'Purple400',
      },
      information: {
        value: 'Blue300',
      },
    },
  },
};

export default color;
