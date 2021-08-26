import type { TextColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<TextColorTokenSchema> = {
  color: {
    text: {
      selected: {
        value: 'B400',
      },
      highEmphasis: {
        value: 'DN1000',
      },
      mediumEmphasis: {
        value: 'DN800',
      },
      lowEmphasis: {
        value: 'DN700',
      },
      onBold: {
        value: 'DN0',
      },
      onBoldWarning: {
        value: 'DN0',
      },
      link: {
        resting: {
          value: 'B400',
        },
        pressed: {
          value: 'B300',
        },
      },
      brand: {
        value: 'B300',
      },
      warning: {
        value: 'Y300',
      },
      danger: {
        value: 'R300',
      },
      success: {
        value: 'G300',
      },
      discovery: {
        value: 'P300',
      },
      disabled: {
        value: 'DN500',
      },
    },
  },
};

export default color;
