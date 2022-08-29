import type { BaseToken } from '../../../palettes/legacy-palette';
import type { ShadowTokenSchema, ValueSchema } from '../../../types';

const shadow: ValueSchema<ShadowTokenSchema<BaseToken>> = {
  elevation: {
    shadow: {
      raised: {
        value: [
          {
            radius: 1,
            offset: { x: 0, y: 1 },
            color: 'N50A',
            opacity: 0.25,
          },
          {
            radius: 1,
            offset: { x: 0, y: 0 },
            color: 'N40A',
            opacity: 0.31,
          },
        ],
      },
      overflow: {
        value: [
          {
            radius: 8,
            offset: { x: 0, y: 8 },
            color: 'N50A',
            opacity: 0.08,
          },
          {
            radius: 1,
            offset: { x: 0, y: 0 },
            color: 'N60A',
            opacity: 0.12,
          },
        ],
      },
      overlay: {
        value: [
          {
            radius: 12,
            offset: { x: 0, y: 8 },
            color: 'N50A',
            opacity: 0.15,
          },
          {
            radius: 1,
            offset: { x: 0, y: 0 },
            color: 'N60A',
            opacity: 0.31,
          },
        ],
      },
    },
  },
};

export default shadow;
