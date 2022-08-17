import type { BaseToken } from '../../../palettes/palette';
import type { SkeletonColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
  color: {
    skeleton: {
      '[default]': {
        value: 'DN200A',
      },
      subtle: {
        value: 'DN100A',
      },
    },
  },
};

export default color;
