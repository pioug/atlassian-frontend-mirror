import type { BaseToken } from '../../../palettes/palette';
import type {
  DeepPartial,
  IconColorTokenSchema,
  ValueSchema,
} from '../../../types';

const color: ValueSchema<DeepPartial<IconColorTokenSchema<BaseToken>>> = {
  color: {
    icon: {
      danger: {
        value: 'Red700',
      },
    },
  },
};

export default color;
