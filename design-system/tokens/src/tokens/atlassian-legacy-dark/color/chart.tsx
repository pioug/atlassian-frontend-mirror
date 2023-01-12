import type { BaseToken } from '../../../palettes/legacy-palette';
import type { ChartColorTokenSchema, ValueSchema } from '../../../types';

const color: ValueSchema<ChartColorTokenSchema<BaseToken>> = {
  color: {
    chart: {
      brand: {
        '[default]': {
          value: 'B400',
        },
        hovered: {
          value: 'B300',
        },
      },
      neutral: {
        '[default]': {
          value: 'DN600',
        },
        hovered: {
          value: 'DN500',
        },
      },
      success: {
        '[default]': {
          '[default]': {
            value: 'G400',
          },
          hovered: {
            value: 'G300',
          },
        },
        bold: {
          '[default]': {
            value: 'G300',
          },
          hovered: {
            value: 'G200',
          },
        },
      },
      danger: {
        '[default]': {
          '[default]': {
            value: 'R400',
          },
          hovered: {
            value: 'R300',
          },
        },
        bold: {
          '[default]': {
            value: 'R300',
          },
          hovered: {
            value: 'R200',
          },
        },
      },
      warning: {
        '[default]': {
          '[default]': {
            value: 'Y400',
          },
          hovered: {
            value: 'Y300',
          },
        },
        bold: {
          '[default]': {
            value: 'Y300',
          },
          hovered: {
            value: 'Y200',
          },
        },
      },
      information: {
        '[default]': {
          '[default]': {
            value: 'B400',
          },
          hovered: {
            value: 'B300',
          },
        },
        bold: {
          '[default]': {
            value: 'B300',
          },
          hovered: {
            value: 'B200',
          },
        },
      },
      discovery: {
        '[default]': {
          '[default]': {
            value: 'P400',
          },
          hovered: {
            value: 'P300',
          },
        },
        bold: {
          '[default]': {
            value: 'P300',
          },
          hovered: {
            value: 'P200',
          },
        },
      },

      categorical: {
        1: {
          '[default]': {
            value: 'T300',
          },
          hovered: {
            value: 'T200',
          },
        },
        2: {
          '[default]': {
            value: 'P300',
          },
          hovered: {
            value: 'P200',
          },
        },
        3: {
          '[default]': {
            // @ts-expect-error
            value: '#D97008',
          },
          hovered: {
            // @ts-expect-error
            value: '#F18D13',
          },
        },
        4: {
          '[default]': {
            // @ts-expect-error
            value: '#F797D2',
          },
          hovered: {
            // @ts-expect-error
            value: '#FDD0EC',
          },
        },
        5: {
          '[default]': {
            value: 'B300',
          },
          hovered: {
            value: 'B200',
          },
        },
        6: {
          '[default]': {
            value: 'P300',
          },
          hovered: {
            value: 'P200',
          },
        },
        7: {
          '[default]': {
            // @ts-expect-error
            value: '#FDD0EC',
          },
          hovered: {
            // @ts-expect-error
            value: '#FFECF8',
          },
        },
        8: {
          '[default]': {
            // @ts-expect-error
            value: '#FEC57B',
          },
          hovered: {
            // @ts-expect-error
            value: '#FFE2BD',
          },
        },
      },

      blue: {
        bold: {
          '[default]': {
            value: 'B500',
          },
          hovered: {
            value: 'B400',
          },
        },
        bolder: {
          '[default]': {
            value: 'B400',
          },
          hovered: {
            value: 'B300',
          },
        },
        boldest: {
          '[default]': {
            value: 'B300',
          },
          hovered: {
            value: 'B200',
          },
        },
      },
      red: {
        bold: {
          '[default]': {
            value: 'R500',
          },
          hovered: {
            value: 'R400',
          },
        },
        bolder: {
          '[default]': {
            value: 'R400',
          },
          hovered: {
            value: 'R300',
          },
        },
        boldest: {
          '[default]': {
            value: 'R300',
          },
          hovered: {
            value: 'R200',
          },
        },
      },
      orange: {
        bold: {
          '[default]': {
            // @ts-expect-error
            value: '#F18D13',
          },
          hovered: {
            // @ts-expect-error
            value: '#FAA53D',
          },
        },
        bolder: {
          '[default]': {
            // @ts-expect-error
            value: '#FAA53D',
          },
          hovered: {
            // @ts-expect-error
            value: '#FEC57B',
          },
        },
        boldest: {
          '[default]': {
            // @ts-expect-error
            value: '#FEC57B',
          },
          hovered: {
            // @ts-expect-error
            value: '#FFE2BD',
          },
        },
      },
      yellow: {
        bold: {
          '[default]': {
            value: 'Y500',
          },
          hovered: {
            value: 'Y400',
          },
        },
        bolder: {
          '[default]': {
            value: 'Y400',
          },
          hovered: {
            value: 'Y300',
          },
        },
        boldest: {
          '[default]': {
            value: 'Y300',
          },
          hovered: {
            value: 'Y200',
          },
        },
      },
      green: {
        bold: {
          '[default]': {
            value: 'G500',
          },
          hovered: {
            value: 'G400',
          },
        },
        bolder: {
          '[default]': {
            value: 'G400',
          },
          hovered: {
            value: 'G300',
          },
        },
        boldest: {
          '[default]': {
            value: 'G300',
          },
          hovered: {
            value: 'G200',
          },
        },
      },
      teal: {
        bold: {
          '[default]': {
            value: 'T500',
          },
          hovered: {
            value: 'T400',
          },
        },
        bolder: {
          '[default]': {
            value: 'T400',
          },
          hovered: {
            value: 'T300',
          },
        },
        boldest: {
          '[default]': {
            value: 'T300',
          },
          hovered: {
            value: 'T200',
          },
        },
      },
      purple: {
        bold: {
          '[default]': {
            value: 'P500',
          },
          hovered: {
            value: 'P400',
          },
        },
        bolder: {
          '[default]': {
            value: 'P400',
          },
          hovered: {
            value: 'P300',
          },
        },
        boldest: {
          '[default]': {
            value: 'P300',
          },
          hovered: {
            value: 'P200',
          },
        },
      },
      magenta: {
        bold: {
          '[default]': {
            // @ts-expect-error
            value: '#CD519D',
          },
          hovered: {
            // @ts-expect-error
            value: '#DA62AC',
          },
        },
        bolder: {
          '[default]': {
            // @ts-expect-error
            value: '#DA62AC',
          },
          hovered: {
            // @ts-expect-error
            value: '#E774BB',
          },
        },
        boldest: {
          '[default]': {
            // @ts-expect-error
            value: '#F797D2',
          },
          hovered: {
            // @ts-expect-error
            value: '#FDD0EC',
          },
        },
      },
      gray: {
        bold: {
          '[default]': {
            value: 'DN600',
          },
          hovered: {
            value: 'DN700',
          },
        },
        bolder: {
          '[default]': {
            value: 'DN700',
          },
          hovered: {
            value: 'DN800',
          },
        },
        boldest: {
          '[default]': {
            value: 'DN800',
          },
          hovered: {
            value: 'DN900',
          },
        },
      },
    },
  },
};

export default color;
