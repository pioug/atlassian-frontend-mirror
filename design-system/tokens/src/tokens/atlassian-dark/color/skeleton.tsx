import type { SkeletonColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<SkeletonColorTokenSchema> = {
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
