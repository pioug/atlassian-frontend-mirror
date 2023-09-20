import type { BaseToken } from '../../../palettes/palette';
import type {
  BackgroundColorTokenSchema,
  DeepPartial,
  ValueSchema,
} from '../../../types';

const color: ValueSchema<DeepPartial<BackgroundColorTokenSchema<BaseToken>>> = {
  color: {
    background: {
      warning: {
        bold: {
          '[default]': { value: 'Yellow300' },
          hovered: { value: 'Yellow400' },
          pressed: { value: 'Yellow500' },
        },
      },
    },
  },
};

export default color;
