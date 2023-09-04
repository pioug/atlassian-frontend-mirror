import type { BaseToken } from '../../../palettes/palette';
import type { AccentColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'Blue300' },
          bolder: { value: 'Blue200' },
        },
        red: {
          '[default]': { value: 'Red300' },
          bolder: { value: 'Red200' },
        },
        orange: {
          '[default]': { value: 'Orange300' },
          bolder: { value: 'Orange200' },
        },
        yellow: {
          '[default]': { value: 'Yellow300' },
          bolder: { value: 'Yellow200' },
        },
        green: {
          '[default]': { value: 'Green300' },
          bolder: { value: 'Green200' },
        },
        purple: {
          '[default]': { value: 'Purple300' },
          bolder: { value: 'Purple200' },
        },
        teal: {
          '[default]': { value: 'Teal300' },
          bolder: { value: 'Teal200' },
        },
        magenta: {
          '[default]': { value: 'Magenta300' },
          bolder: { value: 'Magenta200' },
        },
        lime: {
          '[default]': { value: 'Lime300' },
          bolder: { value: 'Lime200' },
        },
        gray: {
          '[default]': { value: 'DarkNeutral800' },
          bolder: { value: 'DarkNeutral1100' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'Blue500' },
        red: { value: 'Red500' },
        orange: { value: 'Orange500' },
        yellow: { value: 'Yellow500' },
        green: { value: 'Green500' },
        purple: { value: 'Purple500' },
        teal: { value: 'Teal500' },
        magenta: { value: 'Magenta500' },
        lime: { value: 'Lime500' },
        gray: { value: 'DarkNeutral600' },
      },
    },
    border: {
      accent: {
        blue: { value: 'Blue500' },
        red: { value: 'Red500' },
        orange: { value: 'Orange500' },
        yellow: { value: 'Yellow500' },
        green: { value: 'Green500' },
        purple: { value: 'Purple500' },
        teal: { value: 'Teal500' },
        magenta: { value: 'Magenta500' },
        lime: { value: 'Lime500' },
        gray: { value: 'DarkNeutral600' },
      },
    },
    background: {
      accent: {
        blue: {
          subtlest: {
            '[default]': { value: 'Blue1000' },
            hovered: {
              value: 'Blue900',
            },
            pressed: {
              value: 'Blue800',
            },
          },
          subtler: {
            '[default]': { value: 'Blue900' },
            hovered: {
              value: 'Blue800',
            },
            pressed: {
              value: 'Blue700',
            },
          },
          subtle: {
            '[default]': { value: 'Blue800' },
            hovered: {
              value: 'Blue900',
            },
            pressed: {
              value: 'Blue1000',
            },
          },
          bolder: {
            '[default]': { value: 'Blue400' },
            hovered: {
              value: 'Blue300',
            },
            pressed: {
              value: 'Blue200',
            },
          },
        },
        red: {
          subtlest: {
            '[default]': { value: 'Red1000' },
            hovered: {
              value: 'Red900',
            },
            pressed: {
              value: 'Red800',
            },
          },
          subtler: {
            '[default]': { value: 'Red900' },
            hovered: {
              value: 'Red800',
            },
            pressed: {
              value: 'Red700',
            },
          },
          subtle: {
            '[default]': { value: 'Red800' },
            hovered: {
              value: 'Red900',
            },
            pressed: {
              value: 'Red1000',
            },
          },
          bolder: {
            '[default]': { value: 'Red400' },
            hovered: {
              value: 'Red300',
            },
            pressed: {
              value: 'Red200',
            },
          },
        },
        orange: {
          subtlest: {
            '[default]': { value: 'Orange1000' },
            hovered: {
              value: 'Orange900',
            },
            pressed: {
              value: 'Orange800',
            },
          },
          subtler: {
            '[default]': { value: 'Orange900' },
            hovered: {
              value: 'Orange800',
            },
            pressed: {
              value: 'Orange700',
            },
          },
          subtle: {
            '[default]': { value: 'Orange800' },
            hovered: {
              value: 'Orange900',
            },
            pressed: {
              value: 'Orange1000',
            },
          },
          bolder: {
            '[default]': { value: 'Orange400' },
            hovered: {
              value: 'Orange300',
            },
            pressed: {
              value: 'Orange200',
            },
          },
        },
        yellow: {
          subtlest: {
            '[default]': { value: 'Yellow1000' },
            hovered: {
              value: 'Yellow900',
            },
            pressed: {
              value: 'Yellow800',
            },
          },
          subtler: {
            '[default]': { value: 'Yellow900' },
            hovered: {
              value: 'Yellow800',
            },
            pressed: {
              value: 'Yellow700',
            },
          },
          subtle: {
            '[default]': { value: 'Yellow800' },
            hovered: {
              value: 'Yellow900',
            },
            pressed: {
              value: 'Yellow1000',
            },
          },
          bolder: {
            '[default]': { value: 'Yellow400' },
            hovered: {
              value: 'Yellow300',
            },
            pressed: {
              value: 'Yellow200',
            },
          },
        },
        green: {
          subtlest: {
            '[default]': { value: 'Green1000' },
            hovered: {
              value: 'Green900',
            },
            pressed: {
              value: 'Green800',
            },
          },
          subtler: {
            '[default]': { value: 'Green900' },
            hovered: {
              value: 'Green800',
            },
            pressed: {
              value: 'Green700',
            },
          },
          subtle: {
            '[default]': { value: 'Green800' },
            hovered: {
              value: 'Green900',
            },
            pressed: {
              value: 'Green1000',
            },
          },
          bolder: {
            '[default]': { value: 'Green400' },
            hovered: {
              value: 'Green300',
            },
            pressed: {
              value: 'Green200',
            },
          },
        },
        purple: {
          subtlest: {
            '[default]': { value: 'Purple1000' },
            hovered: {
              value: 'Purple900',
            },
            pressed: {
              value: 'Purple800',
            },
          },
          subtler: {
            '[default]': { value: 'Purple900' },
            hovered: {
              value: 'Purple800',
            },
            pressed: {
              value: 'Purple700',
            },
          },
          subtle: {
            '[default]': { value: 'Purple800' },
            hovered: {
              value: 'Purple900',
            },
            pressed: {
              value: 'Purple1000',
            },
          },
          bolder: {
            '[default]': { value: 'Purple400' },
            hovered: {
              value: 'Purple300',
            },
            pressed: {
              value: 'Purple200',
            },
          },
        },
        teal: {
          subtlest: {
            '[default]': { value: 'Teal1000' },
            hovered: {
              value: 'Teal900',
            },
            pressed: {
              value: 'Teal800',
            },
          },
          subtler: {
            '[default]': { value: 'Teal900' },
            hovered: {
              value: 'Teal800',
            },
            pressed: {
              value: 'Teal700',
            },
          },
          subtle: {
            '[default]': { value: 'Teal800' },
            hovered: {
              value: 'Teal900',
            },
            pressed: {
              value: 'Teal1000',
            },
          },
          bolder: {
            '[default]': { value: 'Teal400' },
            hovered: {
              value: 'Teal300',
            },
            pressed: {
              value: 'Teal200',
            },
          },
        },
        magenta: {
          subtlest: {
            '[default]': { value: 'Magenta1000' },
            hovered: {
              value: 'Magenta900',
            },
            pressed: {
              value: 'Magenta800',
            },
          },
          subtler: {
            '[default]': { value: 'Magenta900' },
            hovered: {
              value: 'Magenta800',
            },
            pressed: {
              value: 'Magenta700',
            },
          },
          subtle: {
            '[default]': { value: 'Magenta800' },
            hovered: {
              value: 'Magenta900',
            },
            pressed: {
              value: 'Magenta1000',
            },
          },
          bolder: {
            '[default]': { value: 'Magenta400' },
            hovered: {
              value: 'Magenta300',
            },
            pressed: {
              value: 'Magenta200',
            },
          },
        },
        lime: {
          subtlest: {
            '[default]': { value: 'Lime1000' },
            hovered: {
              value: 'Lime900',
            },
            pressed: {
              value: 'Lime800',
            },
          },
          subtler: {
            '[default]': { value: 'Lime900' },
            hovered: {
              value: 'Lime800',
            },
            pressed: {
              value: 'Lime700',
            },
          },
          subtle: {
            '[default]': { value: 'Lime800' },
            hovered: {
              value: 'Lime900',
            },
            pressed: {
              value: 'Lime1000',
            },
          },
          bolder: {
            '[default]': { value: 'Lime400' },
            hovered: {
              value: 'Lime300',
            },
            pressed: {
              value: 'Lime200',
            },
          },
        },
        gray: {
          subtlest: {
            '[default]': { value: 'DarkNeutral300' },
            hovered: {
              value: 'DarkNeutral350',
            },
            pressed: {
              value: 'DarkNeutral400',
            },
          },
          subtler: {
            '[default]': { value: 'DarkNeutral400' },
            hovered: {
              value: 'DarkNeutral500',
            },
            pressed: {
              value: 'DarkNeutral600',
            },
          },
          subtle: {
            '[default]': { value: 'DarkNeutral500' },
            hovered: {
              value: 'DarkNeutral400',
            },
            pressed: {
              value: 'DarkNeutral350',
            },
          },
          bolder: {
            '[default]': { value: 'DarkNeutral700' },
            hovered: {
              value: 'DarkNeutral800',
            },
            pressed: {
              value: 'DarkNeutral900',
            },
          },
        },
      },
    },
  },
};

export default color;
