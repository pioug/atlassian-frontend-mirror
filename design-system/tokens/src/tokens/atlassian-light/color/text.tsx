import type { TextColorTokenSchema } from '../../../types';

const color: TextColorTokenSchema = {
  color: {
    textHighEmphasis: {
      value: 'N1000',
      attributes: { group: 'paint' },
    },
    textMediumEmphasis: {
      value: 'N800',
      attributes: { group: 'paint' },
    },
    textLowEmphasis: {
      value: 'N700',
      attributes: { group: 'paint' },
    },
    textOnBold: {
      value: 'N0',
      attributes: { group: 'paint' },
    },
    textOnBoldWarning: {
      value: 'N1000',
      attributes: { group: 'paint' },
    },
    textLink: {
      resting: {
        value: 'B700',
        attributes: { group: 'paint' },
      },
      hover: {
        value: 'B800',
        attributes: { group: 'paint' },
      },
      pressed: {
        value: 'B900',
        attributes: { group: 'paint' },
      },
    },
    textBrand: {
      value: 'B800',
      attributes: { group: 'paint' },
    },
    textWarning: {
      value: 'Y800',
      attributes: { group: 'paint' },
    },
    textDanger: {
      value: 'R800',
      attributes: { group: 'paint' },
    },
    textSuccess: {
      value: 'G800',
      attributes: { group: 'paint' },
    },
    textDiscovery: {
      value: 'P800',
      attributes: { group: 'paint' },
    },
    textDisabled: {
      value: 'N500',
      attributes: { group: 'paint' },
    },
  },
};

export default color;
