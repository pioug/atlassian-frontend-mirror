import type { TextColorTokenSchema } from '../../../types';

const color: TextColorTokenSchema = {
  color: {
    textHighEmphasis: {
      value: 'DN1000',
      attributes: { group: 'paint' },
    },
    textMediumEmphasis: {
      value: 'DN800',
      attributes: { group: 'paint' },
    },
    textLowEmphasis: {
      value: 'DN700',
      attributes: { group: 'paint' },
    },
    textOnBold: {
      value: 'DN0',
      attributes: { group: 'paint' },
    },
    textOnBoldWarning: {
      value: 'DN0',
      attributes: { group: 'paint' },
    },
    textLink: {
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
    textBrand: {
      value: 'B300',
      attributes: { group: 'paint' },
    },
    textWarning: {
      value: 'Y300',
      attributes: { group: 'paint' },
    },
    textDanger: {
      value: 'R300',
      attributes: { group: 'paint' },
    },
    textSuccess: {
      value: 'G300',
      attributes: { group: 'paint' },
    },
    textDiscovery: {
      value: 'P300',
      attributes: { group: 'paint' },
    },
    textDisabled: {
      value: 'DN500',
      attributes: { group: 'paint' },
    },
  },
};

export default color;
