import type { BaseToken } from '../../../palettes/legacy-palette';
import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'B400' },
          bolder: { value: 'B500' },
        },
        red: {
          '[default]': { value: 'R400' },
          bolder: { value: 'R500' },
        },
        orange: {
          // @ts-expect-error
          '[default]': { value: '#F18D13' },
          // @ts-expect-error
          bolder: { value: '#B65C02' },
        },
        yellow: {
          '[default]': { value: 'Y400' },
          bolder: { value: 'Y500' },
        },
        green: {
          '[default]': { value: 'G400' },
          bolder: { value: 'G500' },
        },
        purple: {
          '[default]': { value: 'P400' },
          bolder: { value: 'P500' },
        },
        teal: {
          '[default]': { value: 'T400' },
          bolder: { value: 'T500' },
        },
        magenta: {
          // @ts-expect-error
          '[default]': { value: '#E774BB' },
          // @ts-expect-error
          bolder: { value: '#DA62AC' },
        },
        lime: {
          // @ts-expect-error
          '[default]': { value: '#4C6B1F' },
          // @ts-expect-error
          bolder: { value: '#37471F' },
        },
        gray: {
          '[default]': { value: 'N400' },
          bolder: { value: 'N800' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'B300' },
        red: { value: 'R300' },
        // @ts-expect-error
        orange: { value: '#D94008' },
        yellow: { value: 'Y300' },
        green: { value: 'G300' },
        purple: { value: 'P300' },
        teal: { value: 'T300' },
        // @ts-expect-error
        magenta: { value: '#CD519D' },
        // @ts-expect-error
        lime: { value: '#6A9A23' },
        gray: { value: 'N300' },
      },
    },
    border: {
      accent: {
        blue: { value: 'B300' },
        red: { value: 'R300' },
        // @ts-expect-error
        orange: { value: '#D94008' },
        yellow: { value: 'Y300' },
        green: { value: 'G300' },
        purple: { value: 'P300' },
        teal: { value: 'T300' },
        // @ts-expect-error
        magenta: { value: '#CD519D' },
        // @ts-expect-error
        lime: { value: '#6A9A23' },
        gray: { value: 'N300' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: {
            '[default]': { value: 'B100' },
            hovered: {
              value: 'B200',
            },
            pressed: {
              value: 'B300',
            },
          },
          subtler: {
            '[default]': { value: 'B200' },
            hovered: {
              value: 'B300',
            },
            pressed: {
              value: 'B400',
            },
          },
          subtle: {
            '[default]': { value: 'B400' },
            hovered: {
              value: 'B300',
            },
            pressed: {
              value: 'B200',
            },
          },
          bolder: {
            '[default]': { value: 'B400' },
            hovered: {
              value: 'B300',
            },
            pressed: {
              value: 'B200',
            },
          },
        },
        red: {
          subtlest: {
            '[default]': { value: 'R100' },
            hovered: {
              value: 'R200',
            },
            pressed: {
              value: 'R300',
            },
          },
          subtler: {
            '[default]': { value: 'R200' },
            hovered: {
              value: 'R300',
            },
            pressed: {
              value: 'R400',
            },
          },
          subtle: {
            '[default]': { value: 'R400' },
            hovered: {
              value: 'R300',
            },
            pressed: {
              value: 'R200',
            },
          },
          bolder: {
            '[default]': { value: 'R400' },
            hovered: {
              value: 'R300',
            },
            pressed: {
              value: 'R200',
            },
          },
        },
        orange: {
          subtlest: {
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
          subtler: {
            // @ts-expect-error
            '[default]': { value: '#B65C02' },
            hovered: {
              // @ts-expect-error
              value: '#F18D13',
            },
            pressed: {
              // @ts-expect-error
              value: '#FEC57B',
            },
          },
          subtle: {
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
          bolder: {
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
        },
        yellow: {
          subtlest: {
            '[default]': { value: 'Y100' },
            hovered: {
              value: 'Y200',
            },
            pressed: {
              value: 'Y300',
            },
          },
          subtler: {
            '[default]': { value: 'Y200' },
            hovered: {
              value: 'Y300',
            },
            pressed: {
              value: 'Y400',
            },
          },
          subtle: {
            '[default]': { value: 'Y400' },
            hovered: {
              value: 'Y300',
            },
            pressed: {
              value: 'Y200',
            },
          },
          bolder: {
            '[default]': { value: 'Y400' },
            hovered: {
              value: 'Y300',
            },
            pressed: {
              value: 'Y200',
            },
          },
        },
        green: {
          subtlest: {
            '[default]': { value: 'G100' },
            hovered: {
              value: 'G200',
            },
            pressed: {
              value: 'G300',
            },
          },
          subtler: {
            '[default]': { value: 'G200' },
            hovered: {
              value: 'G300',
            },
            pressed: {
              value: 'G400',
            },
          },
          subtle: {
            '[default]': { value: 'G400' },
            hovered: {
              value: 'G300',
            },
            pressed: {
              value: 'G200',
            },
          },
          bolder: {
            '[default]': { value: 'G400' },
            hovered: {
              value: 'G300',
            },
            pressed: {
              value: 'G200',
            },
          },
        },
        purple: {
          subtlest: {
            '[default]': { value: 'P100' },
            hovered: {
              value: 'P200',
            },
            pressed: {
              value: 'P300',
            },
          },
          subtler: {
            '[default]': { value: 'P200' },
            hovered: {
              value: 'P300',
            },
            pressed: {
              value: 'P400',
            },
          },
          subtle: {
            '[default]': { value: 'P400' },
            hovered: {
              value: 'P300',
            },
            pressed: {
              value: 'P200',
            },
          },
          bolder: {
            '[default]': { value: 'P400' },
            hovered: {
              value: 'P300',
            },
            pressed: {
              value: 'P200',
            },
          },
        },
        teal: {
          subtlest: {
            '[default]': { value: 'T100' },
            hovered: {
              value: 'T200',
            },
            pressed: {
              value: 'T300',
            },
          },
          subtler: {
            '[default]': { value: 'T200' },
            hovered: {
              value: 'T300',
            },
            pressed: {
              value: 'T400',
            },
          },
          subtle: {
            '[default]': { value: 'T400' },
            hovered: {
              value: 'T300',
            },
            pressed: {
              value: 'T200',
            },
          },
          bolder: {
            '[default]': { value: 'T400' },
            hovered: {
              value: 'T300',
            },
            pressed: {
              value: 'T200',
            },
          },
        },
        magenta: {
          subtlest: {
            // @ts-expect-error
            '[default]': { value: '#FFECF8' },
            hovered: {
              // @ts-expect-error
              value: '#FDD0EC',
            },
            pressed: {
              // @ts-expect-error
              value: '#F797D2',
            },
          },
          subtler: {
            // @ts-expect-error
            '[default]': { value: '#FDD0EC' },
            hovered: {
              // @ts-expect-error
              value: '#F797D2',
            },
            pressed: {
              // @ts-expect-error
              value: '#E774BB',
            },
          },
          subtle: {
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
          bolder: {
            // @ts-expect-error
            '[default]': { value: '#AE4787' },
            hovered: {
              // @ts-expect-error
              value: '#943D73',
            },
            pressed: {
              // @ts-expect-error
              value: '#50253F',
            },
          },
        },
        lime: {
          subtlest: {
            // @ts-expect-error
            '[default]': { value: '#EEFBDA' },
            hovered: {
              // @ts-expect-error
              value: '#D3F1A7',
            },
            pressed: {
              // @ts-expect-error
              value: '#B3DF72',
            },
          },
          subtler: {
            // @ts-expect-error
            '[default]': { value: '#D3F1A7' },
            hovered: {
              // @ts-expect-error
              value: '#B3DF72',
            },
            pressed: {
              // @ts-expect-error
              value: '#94C748',
            },
          },
          subtle: {
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
          bolder: {
            // @ts-expect-error
            '[default]': { value: '#5B7F24' },
            hovered: {
              // @ts-expect-error
              value: '#37471F',
            },
            pressed: {
              // @ts-expect-error
              value: '#37471F',
            },
          },
        },
        gray: {
          subtlest: {
            '[default]': { value: 'N200' },
            hovered: {
              value: 'N300',
            },
            pressed: {
              value: 'N400',
            },
          },
          subtler: {
            '[default]': { value: 'N300' },
            hovered: {
              value: 'N400',
            },
            pressed: {
              value: 'N500',
            },
          },
          subtle: {
            '[default]': { value: 'N400' },
            hovered: {
              value: 'N300',
            },
            pressed: {
              value: 'N200',
            },
          },
          bolder: {
            '[default]': { value: 'N500' },
            hovered: {
              value: 'N600',
            },
            pressed: {
              value: 'N700',
            },
          },
        },
      },
    },
  },
};

export default color;
