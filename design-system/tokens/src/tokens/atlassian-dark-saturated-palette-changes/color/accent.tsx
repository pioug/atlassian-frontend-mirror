import type { BaseToken } from '../../../palettes/palette';
import type {
  AccentColorTokenSchema,
  DeepPartial,
  ValueSchema,
} from '../../../types';

const color: ValueSchema<DeepPartial<AccentColorTokenSchema<BaseToken>>> = {
  color: {
    icon: {
      accent: {
        red: { value: 'Red600' },
        yellow: { value: 'Yellow300' },
      },
    },
  },
};

export default color;
