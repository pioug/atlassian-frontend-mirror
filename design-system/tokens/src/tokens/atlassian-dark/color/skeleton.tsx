import type { BaseToken } from '../../../palettes/palette';
import type { SkeletonColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
  color: {
    skeleton: {
      '[default]': {
        value: 'DarkNeutral200A',
      },
      subtle: {
        value: 'DarkNeutral100A',
      },
    },
  },
};

export default color;
