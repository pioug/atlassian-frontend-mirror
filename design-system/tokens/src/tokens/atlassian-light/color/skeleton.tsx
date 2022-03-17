import type { SkeletonColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<SkeletonColorTokenSchema> = {
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
