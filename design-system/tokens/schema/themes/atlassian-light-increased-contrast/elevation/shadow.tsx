import type {
  ExtendedValueSchema,
  ShadowTokenSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const shadow: ExtendedValueSchema<ShadowTokenSchema<BaseToken>> = {
  elevation: {
    shadow: {
      raised: {
        value: [
          {
            radius: 0,
            spread: 1,
            offset: { x: 0, y: 0 },
            color: 'Neutral1100',
            opacity: 0.5,
            inset: true,
          },
        ],
      },
      // TODO: Confirm - overflow not included in theme design
      // overflow: {
      //   '[default]': {
      //     value: [
      //       {
      //         radius: 8,
      //         offset: { x: 0, y: 0 },
      //         color: 'Neutral1100',
      //         opacity: 0.16,
      //       },
      //       {
      //         radius: 1,
      //         offset: { x: 0, y: 0 },
      //         color: 'Neutral1100',
      //         opacity: 0.12,
      //       },
      //     ],
      //   },
      //   // @ts-ignore no current palette colour for this yet
      //   spread: { value: '#091e4229' },
      //   // @ts-ignore no current palette colour for this yet
      //   perimeter: { value: '#091e421f' },
      // },
      overlay: {
        value: [
          {
            radius: 0,
            spread: 1,
            offset: { x: 0, y: 0 },
            color: 'Neutral1100',
            opacity: 0.5,
            inset: true,
          },
        ],
      },
    },
  },
};

export default shadow;
