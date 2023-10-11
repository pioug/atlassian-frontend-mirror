import type { BaseToken } from '../../../palettes/palette';
import type {
  ExtendedValueSchema,
  InteractionColorTokenSchema,
} from '../../../types';

const color: ExtendedValueSchema<InteractionColorTokenSchema<BaseToken>> = {
  color: {
    interaction: {
      // TODO: Confirm - was not included in theme design but seems like it should be darker
      // hovered: {
      //   // @ts-ignore temporary values
      //   value: '#00000029',
      // },
      // pressed: {
      //   // @ts-ignore temporary values
      //   value: '#00000052',
      // },
    },
  },
};

export default color;
