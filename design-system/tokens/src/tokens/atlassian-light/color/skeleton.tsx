import type { BaseToken } from '../../../palettes/palette';
import type { SkeletonColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
  color: {
    skeleton: {
      '[default]': {
        value: 'N200A',
      },
      subtle: {
        value: 'N100A',
      },
    },
  },
};

export default color;
