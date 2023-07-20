import type { BaseToken } from '../../../palettes/legacy-palette';
import type { BorderColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BorderColorTokenSchema<BaseToken>> = {
  color: {
    border: {
      '[default]': { value: 'N40A' },
      bold: { value: 'N600' },
      inverse: { value: 'N0' },
      focused: { value: 'B200' },
      input: { value: 'N10' },
      disabled: { value: 'N10' },
      brand: { value: 'B400' },
      selected: { value: 'B400' },
      danger: { value: 'R300' },
      warning: { value: 'Y200' },
      success: { value: 'G400' },
      discovery: { value: 'P100' },
      information: { value: 'B300' },
    },
  },
};

export default color;
