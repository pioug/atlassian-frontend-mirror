import type {
  ExtendedValueSchema,
  TextColorTokenSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<TextColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      '[default]': {
        value: 'DarkNeutral1100',
      },
      subtle: {
        value: 'DarkNeutral1000',
      },
      subtlest: {
        value: 'DarkNeutral900',
      },
      brand: {
        value: 'Blue200',
      },
      selected: {
        value: 'Blue200',
      },
      danger: {
        value: 'Red200',
      },
      warning: {
        '[default]': {
          value: 'Orange200',
        },
        inverse: {
          value: 'DarkNeutral0',
        },
      },
      success: {
        value: 'Green200',
      },
      information: {
        value: 'Blue200',
      },
      discovery: {
        value: 'Purple200',
      },
    },
    link: {
      '[default]': {
        value: 'Blue200',
      },
      pressed: {
        value: 'Blue100',
      },
    },
  },
};

export default color;
