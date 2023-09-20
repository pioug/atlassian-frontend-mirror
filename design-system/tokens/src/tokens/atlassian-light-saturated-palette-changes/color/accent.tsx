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
        red: { value: 'Red700' },
      },
    },
    background: {
      accent: {
        yellow: {
          subtle: {
            '[default]': { value: 'Yellow300' },
            hovered: {
              value: 'Yellow400',
            },
            pressed: {
              value: 'Yellow500',
            },
          },
        },
      },
    },
  },
};

export default color;
