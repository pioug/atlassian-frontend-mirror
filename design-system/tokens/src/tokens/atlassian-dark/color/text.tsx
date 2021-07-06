import type { TextColorTokenSchema } from '../../../types';

const color: TextColorTokenSchema = {
  color: {
    text: {
      selected: {
        value: 'B400',
        attributes: { group: 'paint' },
      },
      highEmphasis: {
        value: 'DN1000',
        attributes: { group: 'paint' },
      },
      mediumEmphasis: {
        value: 'DN800',
        attributes: { group: 'paint' },
      },
      lowEmphasis: {
        value: 'DN700',
        attributes: { group: 'paint' },
      },
      onBold: {
        value: 'DN0',
        attributes: { group: 'paint' },
      },
      onBoldWarning: {
        value: 'DN0',
        attributes: { group: 'paint' },
      },
      link: {
        resting: {
          value: 'B400',
          attributes: { group: 'paint' },
        },
        hover: {
          value: 'B300',
          attributes: { group: 'paint' },
        },
        pressed: {
          value: 'B200',
          attributes: { group: 'paint' },
        },
      },
      brand: {
        value: 'B300',
        attributes: { group: 'paint' },
      },
      warning: {
        value: 'Y300',
        attributes: { group: 'paint' },
      },
      danger: {
        value: 'R300',
        attributes: { group: 'paint' },
      },
      success: {
        value: 'G300',
        attributes: { group: 'paint' },
      },
      discovery: {
        value: 'P300',
        attributes: { group: 'paint' },
      },
      disabled: {
        value: 'DN500',
        attributes: { group: 'paint' },
      },
    },
  },
};

export default color;
