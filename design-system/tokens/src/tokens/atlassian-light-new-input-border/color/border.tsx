import type { BaseToken } from '../../../palettes/palette';
import type { BorderColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BorderColorTokenSchema<BaseToken>> = {
  color: {
    border: {
      '[default]': {
        value: 'Neutral300A',
      },
      bold: {
        value: 'Neutral600',
      },
      inverse: {
        value: 'Neutral0',
      },
      focused: {
        value: 'Blue500',
      },
      input: {
        value: 'Neutral600',
      },
      disabled: {
        value: 'Neutral200A',
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
        value: 'Orange600',
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
