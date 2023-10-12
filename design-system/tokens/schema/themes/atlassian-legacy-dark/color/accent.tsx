import type {
  AccentColorTokenSchema,
  ValueSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/legacy-palette';

const color: ValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'B300' },
          bolder: { value: 'B200' },
        },
        red: {
          '[default]': { value: 'R300' },
          bolder: { value: 'R200' },
        },
        orange: {
          // @ts-expect-error
          '[default]': { value: '#FEC57B' },
          // @ts-expect-error
          bolder: { value: '#F18D13' },
        },
        yellow: {
          '[default]': { value: 'Y300' },
          bolder: { value: 'Y200' },
        },
        green: {
          '[default]': { value: 'G300' },
          bolder: { value: 'G200' },
        },
        purple: {
          '[default]': { value: 'P300' },
          bolder: { value: 'P200' },
        },
        teal: {
          '[default]': { value: 'T300' },
          bolder: { value: 'T200' },
        },
        magenta: {
          // @ts-expect-error
          '[default]': { value: '#F797D2' },
          // @ts-expect-error
          bolder: { value: '#FDD0EC' },
        },
        lime: {
          // @ts-expect-error
          '[default]': { value: '#4C6B1F' },
          // @ts-expect-error
          bolder: { value: '#37471F' },
        },
        gray: {
          '[default]': { value: 'DN300' },
          bolder: { value: 'DN500' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'B500' },
        red: { value: 'R500' },
        // @ts-expect-error
        orange: { value: '#F18D13' },
        yellow: { value: 'Y500' },
        green: { value: 'G500' },
        purple: { value: 'P500' },
        teal: { value: 'T500' },
        // @ts-expect-error
        magenta: { value: '#DA62AC' },
        // @ts-expect-error
        lime: { value: '#6A9A23' },
        gray: { value: 'DN600' },
      },
    },
    border: {
      accent: {
        blue: { value: 'B500' },
        red: { value: 'R500' },
        // @ts-expect-error
        orange: { value: '#F18D13' },
        yellow: { value: 'Y500' },
        green: { value: 'G500' },
        purple: { value: 'P500' },
        teal: { value: 'T500' },
        // @ts-expect-error
        magenta: { value: '#DA62AC' },
        // @ts-expect-error
        lime: { value: '#6A9A23' },
        gray: { value: 'DN600' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: {
            '[default]': { value: 'B500' },
            hovered: {
              value: 'B400',
            },
            pressed: {
              value: 'B300',
            },
          },
          subtler: {
            '[default]': { value: 'B400' },
            hovered: {
              value: 'B300',
            },
            pressed: {
              value: 'B200',
            },
          },
          subtle: {
            '[default]': { value: 'B300' },
            hovered: {
              value: 'B400',
            },
            pressed: {
              value: 'B500',
            },
          },
          bolder: {
            '[default]': { value: 'B100' },
            hovered: {
              value: 'B75',
            },
            pressed: {
              value: 'B50',
            },
          },
        },
        red: {
          subtlest: {
            '[default]': { value: 'R500' },
            hovered: {
              value: 'R400',
            },
            pressed: {
              value: 'R300',
            },
          },
          subtler: {
            '[default]': { value: 'R400' },
            hovered: {
              value: 'R300',
            },
            pressed: {
              value: 'R200',
            },
          },
          subtle: {
            '[default]': { value: 'R300' },
            hovered: {
              value: 'R400',
            },
            pressed: {
              value: 'R500',
            },
          },
          bolder: {
            '[default]': { value: 'R100' },
            hovered: {
              value: 'R75',
            },
            pressed: {
              value: 'R50',
            },
          },
        },
        orange: {
          subtlest: {
            // @ts-expect-error
            '[default]': { value: '#43290F' },
            hovered: {
              // @ts-expect-error
              value: '#5F3811',
            },
            pressed: {
              // @ts-expect-error
              value: '#974F0C',
            },
          },
          subtler: {
            // @ts-expect-error
            '[default]': { value: '#5F3811' },
            hovered: {
              // @ts-expect-error
              value: '#974F0C',
            },
            pressed: {
              // @ts-expect-error
              value: '#B65C02',
            },
          },
          subtle: {
            // @ts-expect-error
            '[default]': { value: '#974F0C' },
            hovered: {
              // @ts-expect-error
              value: '#5F3811',
            },
            pressed: {
              // @ts-expect-error
              value: '#4A2B0F',
            },
          },
          bolder: {
            // @ts-expect-error
            '[default]': { value: '#F18D13' },
            hovered: {
              // @ts-expect-error
              value: '#FEC57B',
            },
            pressed: {
              // @ts-expect-error
              value: '#FFE2BD',
            },
          },
        },
        yellow: {
          subtlest: {
            '[default]': { value: 'Y500' },
            hovered: {
              value: 'Y400',
            },
            pressed: {
              value: 'Y300',
            },
          },
          subtler: {
            '[default]': { value: 'Y400' },
            hovered: {
              value: 'Y300',
            },
            pressed: {
              value: 'Y200',
            },
          },
          subtle: {
            '[default]': { value: 'Y300' },
            hovered: {
              value: 'Y400',
            },
            pressed: {
              value: 'Y500',
            },
          },
          bolder: {
            '[default]': { value: 'Y100' },
            hovered: {
              value: 'Y75',
            },
            pressed: {
              value: 'Y50',
            },
          },
        },
        green: {
          subtlest: {
            '[default]': { value: 'G500' },
            hovered: {
              value: 'G400',
            },
            pressed: {
              value: 'G300',
            },
          },
          subtler: {
            '[default]': { value: 'G400' },
            hovered: {
              value: 'G300',
            },
            pressed: {
              value: 'G200',
            },
          },
          subtle: {
            '[default]': { value: 'G300' },
            hovered: {
              value: 'G400',
            },
            pressed: {
              value: 'G500',
            },
          },
          bolder: {
            '[default]': { value: 'G100' },
            hovered: {
              value: 'G75',
            },
            pressed: {
              value: 'G50',
            },
          },
        },
        purple: {
          subtlest: {
            '[default]': { value: 'P500' },
            hovered: {
              value: 'P400',
            },
            pressed: {
              value: 'P300',
            },
          },
          subtler: {
            '[default]': { value: 'P400' },
            hovered: {
              value: 'P300',
            },
            pressed: {
              value: 'P200',
            },
          },
          subtle: {
            '[default]': { value: 'P300' },
            hovered: {
              value: 'P400',
            },
            pressed: {
              value: 'P500',
            },
          },
          bolder: {
            '[default]': { value: 'P100' },
            hovered: {
              value: 'P75',
            },
            pressed: {
              value: 'P50',
            },
          },
        },
        teal: {
          subtlest: {
            '[default]': { value: 'T500' },
            hovered: {
              value: 'T400',
            },
            pressed: {
              value: 'T300',
            },
          },
          subtler: {
            '[default]': { value: 'T400' },
            hovered: {
              value: 'T300',
            },
            pressed: {
              value: 'T200',
            },
          },
          subtle: {
            '[default]': { value: 'T300' },
            hovered: {
              value: 'T400',
            },
            pressed: {
              value: 'T500',
            },
          },
          bolder: {
            '[default]': { value: 'T100' },
            hovered: {
              value: 'T75',
            },
            pressed: {
              value: 'T50',
            },
          },
        },
        magenta: {
          subtlest: {
            // @ts-expect-error
            '[default]': { value: '#341829' },
            hovered: {
              // @ts-expect-error
              value: '#50253F',
            },
            pressed: {
              // @ts-expect-error
              value: '#943D73',
            },
          },
          subtler: {
            // @ts-expect-error
            '[default]': { value: '#50253F' },
            hovered: {
              // @ts-expect-error
              value: '#943D73',
            },
            pressed: {
              // @ts-expect-error
              value: '#AE4787',
            },
          },
          subtle: {
            // @ts-expect-error
            '[default]': { value: '#943D73' },
            hovered: {
              // @ts-expect-error
              value: '#50253F',
            },
            pressed: {
              // @ts-expect-error
              value: '#421F34',
            },
          },
          bolder: {
            // @ts-expect-error
            '[default]': { value: '#E774BB' },
            hovered: {
              // @ts-expect-error
              value: '#F797D2',
            },
            pressed: {
              // @ts-expect-error
              value: '#FDD0EC',
            },
          },
        },
        lime: {
          subtlest: {
            // @ts-expect-error
            '[default]': { value: '#2A3818' },
            hovered: {
              // @ts-expect-error
              value: '#37471F',
            },
            pressed: {
              // @ts-expect-error
              value: '#4C6B1F',
            },
          },
          subtler: {
            // @ts-expect-error
            '[default]': { value: '#37471F' },
            hovered: {
              // @ts-expect-error
              value: '#4C6B1F',
            },
            pressed: {
              // @ts-expect-error
              value: '#5B7F24',
            },
          },
          subtle: {
            // @ts-expect-error
            '[default]': { value: '#4C6B1F' },
            hovered: {
              // @ts-expect-error
              value: '#37471F',
            },
            pressed: {
              // @ts-expect-error
              value: '#2A3818',
            },
          },
          bolder: {
            // @ts-expect-error
            '[default]': { value: '#94C748' },
            hovered: {
              // @ts-expect-error
              value: '#B3DF72',
            },
            pressed: {
              // @ts-expect-error
              value: '#D3F1A7',
            },
          },
        },
        gray: {
          subtlest: {
            '[default]': { value: 'DN300' },
            hovered: {
              value: 'DN400',
            },
            pressed: {
              value: 'DN500',
            },
          },
          subtler: {
            '[default]': { value: 'DN400' },
            hovered: {
              value: 'DN300',
            },
            pressed: {
              value: 'DN200',
            },
          },
          subtle: {
            '[default]': { value: 'DN500' },
            hovered: {
              value: 'DN600',
            },
            pressed: {
              value: 'DN700',
            },
          },
          bolder: {
            '[default]': { value: 'DN700' },
            hovered: {
              value: 'DN600',
            },
            pressed: {
              value: 'DN500',
            },
          },
        },
      },
    },
  },
};

export default color;
