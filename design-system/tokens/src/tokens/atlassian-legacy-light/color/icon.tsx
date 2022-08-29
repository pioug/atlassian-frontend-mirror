import type { BaseToken } from '../../../palettes/legacy-palette';
import type { IconColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<IconColorTokenSchema<BaseToken>> = {
  color: {
    icon: {
      '[default]': { value: 'N400' },
      subtle: { value: 'N200' },
      inverse: { value: 'N0' },
      disabled: { value: 'N90' },
      brand: { value: 'B300' },
      selected: { value: 'B400' },
      danger: { value: 'R400' },
      warning: {
        '[default]': { value: 'Y200' },
        inverse: { value: 'N700' },
      },
      success: { value: 'G400' },
      discovery: { value: 'P200' },
      information: { value: 'B500' },
    },
  },
};

export default color;
