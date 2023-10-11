import type { BaseToken } from '../../../palettes/palette';
import type {
  ExtendedValueSchema,
  SkeletonColorTokenSchema,
} from '../../../types';

const color: ExtendedValueSchema<SkeletonColorTokenSchema<BaseToken>> = {
  color: {
    skeleton: {
      // TODO: Confirm - was not included in theme design but seems like it should be darker
      // but I think they should definitely be darker?
      // '[default]': {
      //   value: 'Neutral200A',
      // },
      // subtle: {
      //   value: 'Neutral100A',
      // },
    },
  },
};

export default color;
