import type { TextColorTokenSchema } from '../../../types';

const color: TextColorTokenSchema = {
  color: {
    text: {
      selected: {
        value: 'B700',
        attributes: { group: 'paint' },
      },
      highEmphasis: {
        value: 'N1000',
        attributes: { group: 'paint' },
      },
      mediumEmphasis: {
        value: 'N800',
        attributes: { group: 'paint' },
      },
      lowEmphasis: {
        value: 'N700',
        attributes: { group: 'paint' },
      },
      onBold: {
        value: 'N0',
        attributes: { group: 'paint' },
      },
      onBoldWarning: {
        value: 'N1000',
        attributes: { group: 'paint' },
      },
      link: {
        resting: {
          value: 'B700',
          attributes: { group: 'paint' },
        },
        pressed: {
          value: 'B800',
          attributes: { group: 'paint' },
        },
      },
      brand: {
        value: 'B800',
        attributes: { group: 'paint' },
      },
      warning: {
        value: 'O800',
        attributes: { group: 'paint' },
      },
      danger: {
        value: 'R800',
        attributes: { group: 'paint' },
      },
      success: {
        value: 'G800',
        attributes: { group: 'paint' },
      },
      discovery: {
        value: 'P800',
        attributes: { group: 'paint' },
      },
      disabled: {
        value: 'N500',
        attributes: { group: 'paint' },
      },
    },
  },
};

export default color;
