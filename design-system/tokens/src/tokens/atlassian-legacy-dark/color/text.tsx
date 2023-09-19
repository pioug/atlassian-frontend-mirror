import type { BaseToken } from '../../../palettes/legacy-palette';
import type { TextColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<TextColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      '[default]': {
        value: 'DN900',
      },
      subtle: {
        value: 'DN400',
      },
      subtlest: {
        value: 'DN200',
      },
      inverse: {
        value: 'DN0',
      },
      disabled: {
        value: 'DN30',
      },
      brand: {
        value: 'B400',
      },
      selected: {
        value: 'B400',
      },
      danger: {
        value: 'R300',
      },
      warning: {
        '[default]': {
          value: 'N800',
        },
        inverse: {
          value: 'DN0',
        },
      },
      success: {
        value: 'G300',
      },
      information: {
        value: 'B300',
      },
      discovery: {
        value: 'P300',
      },
    },
    link: {
      '[default]': {
        value: 'B400',
      },
      pressed: {
        value: 'B300',
      },
      visited: {
        value: 'P300',
      },
    },
  },
};

export default color;
