import type { BaseToken } from '../../../palettes/palette';
import type { ChartColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<ChartColorTokenSchema<BaseToken>> = {
  color: {
    chart: {
      brand: {
        '[default]': {
          value: 'Blue500',
        },
        hovered: {
          value: 'Blue400',
        },
      },
      neutral: {
        '[default]': {
          value: 'DarkNeutral600',
        },
        hovered: {
          value: 'DarkNeutral700',
        },
      },
      success: {
        '[default]': {
          '[default]': {
            value: 'Green500',
          },
          hovered: {
            value: 'Green400',
          },
        },
        bold: {
          '[default]': {
            value: 'Green300',
          },
          hovered: {
            value: 'Green200',
          },
        },
      },
      danger: {
        '[default]': {
          '[default]': {
            value: 'Red600',
          },
          hovered: {
            value: 'Red500',
          },
        },
        bold: {
          '[default]': {
            value: 'Red300',
          },
          hovered: {
            value: 'Red200',
          },
        },
      },
      warning: {
        '[default]': {
          '[default]': {
            value: 'Yellow500',
          },
          hovered: {
            value: 'Yellow400',
          },
        },
        bold: {
          '[default]': {
            value: 'Yellow300',
          },
          hovered: {
            value: 'Yellow200',
          },
        },
      },
      information: {
        '[default]': {
          '[default]': {
            value: 'Blue600',
          },
          hovered: {
            value: 'Blue500',
          },
        },
        bold: {
          '[default]': {
            value: 'Blue300',
          },
          hovered: {
            value: 'Blue200',
          },
        },
      },
      discovery: {
        '[default]': {
          '[default]': {
            value: 'Purple600',
          },
          hovered: {
            value: 'Purple500',
          },
        },
        bold: {
          '[default]': {
            value: 'Purple300',
          },
          hovered: {
            value: 'Purple200',
          },
        },
      },
      categorical: {
        1: {
          '[default]': {
            value: 'Teal600',
          },
          hovered: {
            value: 'Teal500',
          },
        },
        2: {
          '[default]': {
            value: 'Purple300',
          },
          hovered: {
            value: 'Purple200',
          },
        },
        3: {
          '[default]': {
            value: 'Orange600',
          },
          hovered: {
            value: 'Orange500',
          },
        },
        4: {
          '[default]': {
            value: 'Magenta300',
          },
          hovered: {
            value: 'Magenta200',
          },
        },
        5: {
          '[default]': {
            value: 'Blue200',
          },
          hovered: {
            value: 'Blue100',
          },
        },
        6: {
          '[default]': {
            value: 'Purple600',
          },
          hovered: {
            value: 'Purple500',
          },
        },
        7: {
          '[default]': {
            value: 'Magenta200',
          },
          hovered: {
            value: 'Magenta100',
          },
        },
        8: {
          '[default]': {
            value: 'Orange300',
          },
          hovered: {
            value: 'Orange200',
          },
        },
      },
      blue: {
        bold: {
          '[default]': {
            value: 'Blue600',
          },
          hovered: {
            value: 'Blue500',
          },
        },
        bolder: {
          '[default]': {
            value: 'Blue500',
          },
          hovered: {
            value: 'Blue400',
          },
        },
        boldest: {
          '[default]': {
            value: 'Blue300',
          },
          hovered: {
            value: 'Blue200',
          },
        },
      },
      red: {
        bold: {
          '[default]': {
            value: 'Red600',
          },
          hovered: {
            value: 'Red500',
          },
        },
        bolder: {
          '[default]': {
            value: 'Red500',
          },
          hovered: {
            value: 'Red400',
          },
        },
        boldest: {
          '[default]': {
            value: 'Red300',
          },
          hovered: {
            value: 'Red200',
          },
        },
      },
      orange: {
        bold: {
          '[default]': {
            value: 'Orange500',
          },
          hovered: {
            value: 'Orange400',
          },
        },
        bolder: {
          '[default]': {
            value: 'Orange400',
          },
          hovered: {
            value: 'Orange300',
          },
        },
        boldest: {
          '[default]': {
            value: 'Orange300',
          },
          hovered: {
            value: 'Orange200',
          },
        },
      },
      yellow: {
        bold: {
          '[default]': {
            value: 'Yellow500',
          },
          hovered: {
            value: 'Yellow400',
          },
        },
        bolder: {
          '[default]': {
            value: 'Yellow400',
          },
          hovered: {
            value: 'Yellow300',
          },
        },
        boldest: {
          '[default]': {
            value: 'Yellow300',
          },
          hovered: {
            value: 'Yellow200',
          },
        },
      },
      green: {
        bold: {
          '[default]': {
            value: 'Green500',
          },
          hovered: {
            value: 'Green400',
          },
        },
        bolder: {
          '[default]': {
            value: 'Green400',
          },
          hovered: {
            value: 'Green300',
          },
        },
        boldest: {
          '[default]': {
            value: 'Green300',
          },
          hovered: {
            value: 'Green200',
          },
        },
      },
      teal: {
        bold: {
          '[default]': {
            value: 'Teal500',
          },
          hovered: {
            value: 'Teal400',
          },
        },
        bolder: {
          '[default]': {
            value: 'Teal400',
          },
          hovered: {
            value: 'Teal300',
          },
        },
        boldest: {
          '[default]': {
            value: 'Teal300',
          },
          hovered: {
            value: 'Teal200',
          },
        },
      },
      purple: {
        bold: {
          '[default]': {
            value: 'Purple600',
          },
          hovered: {
            value: 'Purple500',
          },
        },
        bolder: {
          '[default]': {
            value: 'Purple500',
          },
          hovered: {
            value: 'Purple400',
          },
        },
        boldest: {
          '[default]': {
            value: 'Purple300',
          },
          hovered: {
            value: 'Purple200',
          },
        },
      },
      magenta: {
        bold: {
          '[default]': {
            value: 'Magenta600',
          },
          hovered: {
            value: 'Magenta500',
          },
        },
        bolder: {
          '[default]': {
            value: 'Magenta500',
          },
          hovered: {
            value: 'Magenta400',
          },
        },
        boldest: {
          '[default]': {
            value: 'Magenta300',
          },
          hovered: {
            value: 'Magenta200',
          },
        },
      },
      lime: {
        bold: {
          '[default]': {
            value: 'Teal500',
          },
          hovered: {
            value: 'Teal400',
          },
        },
        bolder: {
          '[default]': {
            value: 'Teal400',
          },
          hovered: {
            value: 'Teal300',
          },
        },
        boldest: {
          '[default]': {
            value: 'Teal300',
          },
          hovered: {
            value: 'Teal200',
          },
        },
      },
      gray: {
        bold: {
          '[default]': {
            value: 'DarkNeutral600',
          },
          hovered: {
            value: 'DarkNeutral700',
          },
        },
        bolder: {
          '[default]': {
            value: 'DarkNeutral700',
          },
          hovered: {
            value: 'DarkNeutral800',
          },
        },
        boldest: {
          '[default]': {
            value: 'DarkNeutral800',
          },
          hovered: {
            value: 'DarkNeutral900',
          },
        },
      },
    },
  },
};

export default color;
