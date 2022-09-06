import type { OpacityTokenSchema, ValueSchema } from '../../../types';

const opacity: ValueSchema<OpacityTokenSchema> = {
  opacity: {
    disabled: {
      value: 'Opacity40',
    },
    loading: {
      value: 'Opacity20',
    },
  },
};

export default opacity;
