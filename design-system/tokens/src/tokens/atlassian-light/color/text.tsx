import type { TextColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<TextColorTokenSchema> = {
  color: {
    text: {
      selected: {
        value: 'B700',
      },
      highEmphasis: {
        value: 'N1000',
      },
      mediumEmphasis: {
        value: 'N800',
      },
      lowEmphasis: {
        value: 'N700',
      },
      onBold: {
        value: 'N0',
      },
      onBoldWarning: {
        value: 'N1000',
      },
      link: {
        resting: {
          value: 'B700',
        },
        pressed: {
          value: 'B800',
        },
      },
      brand: {
        value: 'B800',
      },
      warning: {
        value: 'O800',
      },
      danger: {
        value: 'R800',
      },
      success: {
        value: 'G800',
      },
      discovery: {
        value: 'P800',
      },
      disabled: {
        value: 'N500',
      },
    },
  },
};

export default color;
