import type { BackgroundColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<BackgroundColorTokenSchema> = {
  color: {
    background: {
      sunken: {
        value: 'DN-100A',
      },
      default: {
        value: 'DN0',
      },
      card: {
        value: 'DN100',
      },
      overlay: {
        value: 'DN200',
      },
      selected: {
        resting: {
          value: 'DN200A',
        },
        hover: {
          value: 'DN300A',
        },
        pressed: {
          value: 'DN400A',
        },
      },
      blanket: {
        value: 'DN-100A',
      },
      disabled: {
        value: 'DN200A',
      },
      boldBrand: {
        resting: {
          value: 'B400',
        },
        hover: {
          value: 'B300',
        },
        pressed: {
          value: 'B200',
        },
      },
      subtleBrand: {
        resting: {
          value: 'B1000',
        },
        hover: {
          value: 'B900',
        },
        pressed: {
          value: 'B800',
        },
      },
      boldDanger: {
        resting: {
          value: 'R400',
        },
        hover: {
          value: 'R300',
        },
        pressed: {
          value: 'R200',
        },
      },
      subtleDanger: {
        resting: {
          value: 'R1000',
        },
        hover: {
          value: 'R900',
        },
        pressed: {
          value: 'R800',
        },
      },
      boldWarning: {
        resting: {
          value: 'Y400',
        },
        hover: {
          value: 'Y300',
        },
        pressed: {
          value: 'Y200',
        },
      },
      subtleWarning: {
        resting: {
          value: 'Y1000',
        },
        hover: {
          value: 'Y900',
        },
        pressed: {
          value: 'Y800',
        },
      },
      boldSuccess: {
        resting: {
          value: 'G400',
        },
        hover: {
          value: 'G300',
        },
        pressed: {
          value: 'G200',
        },
      },
      subtleSuccess: {
        resting: {
          value: 'G1000',
        },
        hover: {
          value: 'G900',
        },
        pressed: {
          value: 'G800',
        },
      },
      boldDiscovery: {
        resting: {
          value: 'P400',
        },
        hover: {
          value: 'P300',
        },
        pressed: {
          value: 'P200',
        },
      },
      subtleDiscovery: {
        resting: {
          value: 'P1000',
        },
        hover: {
          value: 'P900',
        },
        pressed: {
          value: 'P800',
        },
      },
      boldNeutral: {
        resting: {
          value: 'DN800',
        },
        hover: {
          value: 'DN900',
        },
        pressed: {
          value: 'DN1000',
        },
      },
      transparentNeutral: {
        hover: {
          value: 'DN200A',
        },
        pressed: {
          value: 'DN300A',
        },
      },
      subtleNeutral: {
        resting: {
          value: 'DN200A',
        },
        hover: {
          value: 'DN300A',
        },
        pressed: {
          value: 'DN400A',
        },
      },
      subtleBorderedNeutral: {
        resting: {
          value: 'DN100A',
        },
        pressed: {
          value: 'DN200A',
        },
      },
    },
  },
};

export default color;
