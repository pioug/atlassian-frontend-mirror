import type { AttributeSchema, SkeletonColorTokenSchema } from '../../../types';

const color: AttributeSchema<SkeletonColorTokenSchema> = {
  color: {
    skeleton: {
      '[default]': {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.8.0',
          description: 'Use for skeleton loading states',
        },
      },
      subtle: {
        attributes: {
          group: 'paint',
          state: 'active',
          introduced: '0.8.0',
          description:
            'Use for the pulse or shimmer effect in skeleton loading states',
        },
      },
    },
  },
};

export default color;
