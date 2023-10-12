import type {
  AccentColorTokenSchema,
  ExtendedValueSchema,
} from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const color: ExtendedValueSchema<AccentColorTokenSchema<BaseToken>> = {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': { value: 'Blue200' },
          bolder: { value: 'Blue100' },
        },
        red: {
          '[default]': { value: 'Red200' },
          bolder: { value: 'Red100' },
        },
        orange: {
          '[default]': { value: 'Orange200' },
          bolder: { value: 'Orange100' },
        },
        yellow: {
          '[default]': { value: 'Yellow200' },
          bolder: { value: 'Yellow100' },
        },
        green: {
          '[default]': { value: 'Green200' },
          bolder: { value: 'Green100' },
        },
        purple: {
          '[default]': { value: 'Purple200' },
          bolder: { value: 'Purple100' },
        },
        teal: {
          '[default]': { value: 'Teal200' },
          bolder: { value: 'Teal100' },
        },
        magenta: {
          '[default]': { value: 'Magenta200' },
          bolder: { value: 'Magenta100' },
        },
        lime: {
          '[default]': { value: 'Lime200' },
          bolder: { value: 'Lime100' },
        },
        gray: {
          '[default]': { value: 'DarkNeutral900' },
          bolder: { value: 'DarkNeutral1100' },
        },
      },
    },
    icon: {
      accent: {
        blue: { value: 'Blue300' },
        red: { value: 'Red300' },
        orange: { value: 'Orange300' },
        yellow: { value: 'Yellow300' },
        green: { value: 'Green300' },
        purple: { value: 'Purple300' },
        teal: { value: 'Teal300' },
        magenta: { value: 'Magenta300' },
        lime: { value: 'Lime300' },
        gray: { value: 'DarkNeutral800' },
      },
    },
    border: {
      accent: {
        blue: { value: 'Blue300' },
        red: { value: 'Red300' },
        orange: { value: 'Orange300' },
        yellow: { value: 'Yellow300' },
        green: { value: 'Green300' },
        purple: { value: 'Purple300' },
        teal: { value: 'Teal300' },
        magenta: { value: 'Magenta300' },
        lime: { value: 'Lime300' },
        gray: { value: 'DarkNeutral800' },
      },
    },
    background: {
      accent: {
        red: {
          bolder: {
            '[default]': { value: 'Red200' },
            hovered: {
              value: 'Red100',
            },
          },
        },
        orange: {
          bolder: {
            '[default]': { value: 'Orange200' },
            hovered: {
              value: 'Orange100',
            },
          },
        },
        yellow: {
          bolder: {
            '[default]': { value: 'Yellow200' },
            hovered: {
              value: 'Yellow100',
            },
          },
        },
        green: {
          bolder: {
            '[default]': { value: 'Green200' },
            hovered: {
              value: 'Green100',
            },
          },
        },
        purple: {
          bolder: {
            '[default]': { value: 'Purple200' },
            hovered: {
              value: 'Purple100',
            },
          },
        },
        teal: {
          bolder: {
            '[default]': { value: 'Teal200' },
            hovered: {
              value: 'Teal100',
            },
          },
        },
        magenta: {
          bolder: {
            '[default]': { value: 'Magenta200' },
            hovered: {
              value: 'Magenta100',
            },
          },
        },
        lime: {
          bolder: {
            '[default]': { value: 'Lime200' },
            hovered: {
              value: 'Lime100',
            },
          },
        },
        gray: {
          subtle: {
            '[default]': { value: 'DarkNeutral400' },
            hovered: {
              value: 'DarkNeutral300',
            },
            pressed: {
              value: 'DarkNeutral200',
            },
          },
          bolder: {
            '[default]': { value: 'DarkNeutral800' },
            hovered: {
              value: 'DarkNeutral900',
            },
            pressed: {
              value: 'DarkNeutral1000',
            },
          },
        },
      },
    },
  },
};

export default color;
