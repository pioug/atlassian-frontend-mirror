import type {
  AccentColorTokenSchema,
  DeepPartial,
  ValueSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

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
