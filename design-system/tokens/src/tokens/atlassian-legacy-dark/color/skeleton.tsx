import type { BaseToken } from '../../../palettes/legacy-palette';
import type { SkeletonColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
  color: {
    skeleton: {
      '[default]': {
        value: 'DN20A',
      },
      subtle: {
        value: 'DN10A',
      },
    },
  },
};

export default color;
