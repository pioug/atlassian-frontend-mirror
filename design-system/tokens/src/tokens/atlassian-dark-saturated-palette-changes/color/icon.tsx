import type { BaseToken } from '../../../palettes/palette';
import type {
  DeepPartial,
  IconColorTokenSchema,
  ValueSchema,
} from '../../../types';

const color: ValueSchema<DeepPartial<IconColorTokenSchema<BaseToken>>> = {
  color: {
    icon: {
      warning: {
        '[default]': {
          value: 'Yellow300',
        },
      },
    },
  },
};

export default color;
