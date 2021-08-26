import type { BackgroundColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BackgroundColorTokenSchema> = {
  color: {
    background: {
      sunken: {
        value: 'N100A',
      },
      default: {
        value: 'N0',
      },
      card: {
        value: 'N0',
      },
      overlay: {
        value: 'N0',
      },
      selected: {
        resting: {
          value: 'B100',
        },
        hover: {
          value: 'B200',
        },
        pressed: {
          value: 'B300',
        },
      },
      blanket: {
        value: 'N500A',
      },
      disabled: {
        value: 'N200A',
      },
      boldBrand: {
        resting: {
          value: 'B700',
        },
        hover: {
          value: 'B800',
        },
        pressed: {
          value: 'B900',
        },
      },
      subtleBrand: {
        resting: {
          value: 'B100',
        },
        hover: {
          value: 'B200',
        },
        pressed: {
          value: 'B300',
        },
      },
      boldDanger: {
        resting: {
          value: 'R700',
        },
        hover: {
          value: 'R800',
        },
        pressed: {
          value: 'R900',
        },
      },
      subtleDanger: {
        resting: {
          value: 'R100',
        },
        hover: {
          value: 'R200',
        },
        pressed: {
          value: 'R300',
        },
      },
      boldWarning: {
        resting: {
          value: 'Y400',
        },
        hover: {
          value: 'Y500',
        },
        pressed: {
          value: 'Y600',
        },
      },
      subtleWarning: {
        resting: {
          value: 'Y100',
        },
        hover: {
          value: 'Y200',
        },
        pressed: {
          value: 'Y300',
        },
      },
      boldSuccess: {
        resting: {
          value: 'G700',
        },
        hover: {
          value: 'G800',
        },
        pressed: {
          value: 'G900',
        },
      },
      subtleSuccess: {
        resting: {
          value: 'G100',
        },
        hover: {
          value: 'G200',
        },
        pressed: {
          value: 'G300',
        },
      },
      boldDiscovery: {
        resting: {
          value: 'P700',
        },
        hover: {
          value: 'P800',
        },
        pressed: {
          value: 'P900',
        },
      },
      subtleDiscovery: {
        resting: {
          value: 'P100',
        },
        hover: {
          value: 'P200',
        },
        pressed: {
          value: 'P300',
        },
      },
      boldNeutral: {
        resting: {
          value: 'N800',
        },
        hover: {
          value: 'N900',
        },
        pressed: {
          value: 'N1000',
        },
      },
      transparentNeutral: {
        hover: {
          value: 'N200A',
        },
        pressed: {
          value: 'N300A',
        },
      },
      subtleNeutral: {
        resting: {
          value: 'N200A',
        },
        hover: {
          value: 'N300A',
        },
        pressed: {
          value: 'N400A',
        },
      },
      subtleBorderedNeutral: {
        resting: {
          value: 'N100A',
        },
        pressed: {
          value: 'N200A',
        },
      },
    },
  },
};

export default color;
