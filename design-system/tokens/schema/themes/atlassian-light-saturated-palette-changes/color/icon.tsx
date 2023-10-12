import type {
  DeepPartial,
  IconColorTokenSchema,
  ValueSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

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
