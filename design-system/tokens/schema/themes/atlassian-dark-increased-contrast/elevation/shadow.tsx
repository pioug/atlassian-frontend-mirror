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
            color: 'DarkNeutral500A',
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
      //         radius: 12,
      //         offset: { x: 0, y: 0 },
      //         // @ts-ignore no current palette colour for this yet
      //         color: '#030404',
      //         // This opacity overrides the color alpha.
      //         opacity: 0.56,
      //       },
      //       {
      //         radius: 1,
      //         offset: { x: 0, y: 0 },
      //         // @ts-ignore no current palette colour for this yet
      //         color: '#030404',
      //         // This opacity overrides the color alpha.
      //         opacity: 0.5,
      //       },
      //     ],
      //   },
      //   // @ts-ignore no current palette colour for this yet
      //   spread: { value: '#0304048f' },
      //   // @ts-ignore no current palette colour for this yet
      //   perimeter: { value: '#03040480' },
      // },
      overlay: {
        value: [
          {
            radius: 0,
            spread: 1,
            offset: { x: 0, y: 0 },
            color: 'DarkNeutral500A',
            opacity: 0.5,
            inset: true,
          },
        ],
      },
    },
  },
};

export default shadow;
