import type {
  BorderColorTokenSchema,
  ExtendedValueSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<BorderColorTokenSchema<BaseToken>> = {
  color: {
    border: {
      '[default]': {
        value: 'DarkNeutral500A',
      },
      bold: {
        value: 'DarkNeutral800',
      },
      input: {
        value: 'DarkNeutral800',
      },
      disabled: {
        value: 'DarkNeutral300A',
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
        value: 'Orange300',
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
