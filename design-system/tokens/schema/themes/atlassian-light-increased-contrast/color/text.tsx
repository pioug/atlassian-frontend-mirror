import type {
  ExtendedValueSchema,
  TextColorTokenSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<TextColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      '[default]': {
        value: 'Neutral1100',
      },
      subtle: {
        value: 'Neutral1000',
      },
      subtlest: {
        value: 'Neutral900',
      },
      brand: {
        value: 'Blue900',
      },
      selected: {
        value: 'Blue900',
      },
      danger: {
        value: 'Red900',
      },
      warning: {
        '[default]': {
          value: 'Orange900',
        },
        inverse: {
          value: 'Neutral0',
        },
      },
      success: {
        value: 'Green900',
      },
      information: {
        value: 'Blue900',
      },
      discovery: {
        value: 'Purple900',
      },
    },
    link: {
      '[default]': {
        value: 'Blue900',
      },
      pressed: {
        value: 'Blue900',
      },
    },
  },
};

export default color;
