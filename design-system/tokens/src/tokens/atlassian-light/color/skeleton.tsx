import type { BaseToken } from '../../../palettes/palette';
import type { SkeletonColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
  color: {
    skeleton: {
      '[default]': {
        value: 'Neutral200A',
      },
      subtle: {
        value: 'Neutral100A',
      },
    },
  },
};

export default color;
