import type {
  ExtendedValueSchema,
  InteractionColorTokenSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<InteractionColorTokenSchema<BaseToken>> = {
  color: {
    interaction: {
      // TODO: Confirm - not included in theme design
      // hovered: {
      //   // @ts-ignore temporary values
      //   value: '#ffffff33',
      // },
      // pressed: {
      //   // @ts-ignore temporary values
      //   value: '#ffffff5c',
      // },
    },
  },
};

export default color;
