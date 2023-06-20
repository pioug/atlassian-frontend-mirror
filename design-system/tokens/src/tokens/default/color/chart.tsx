import type { BaseToken } from '../../../palettes/palette';
import type { AttributeSchema, ChartColorTokenSchema } from '../../../types';

const color: AttributeSchema<ChartColorTokenSchema<BaseToken>> = {
  color: {
    chart: {
      brand: {
        '[default]': {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.13.3',
            description:
              'Our primary color for data visualisation. Use when only one color is required.',
          },
        },
        hovered: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.13.3',
            description: 'Hovered state of color.chart.brand.',
          },
        },
      },
      neutral: {
        '[default]': {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.13.3',
            description:
              "A secondary color for data visualisation or to communicate 'to-do' statues.",
          },
        },
        hovered: {
          attributes: {
            group: 'paint',
            state: 'active',
            introduced: '0.13.3',
            description: 'Hovered state of color.chart.neutral.',
          },
        },
      },
      success: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                "For data visualisation communicating positive information, such as 'on track'.",
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.success.',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'A stronger emphasis option of color.chart.success.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.success.bold.',
            },
          },
        },
      },
      danger: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                "For data visualisation communicating negative information, such as 'off track'.",
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.danger.',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'A stronger emphasis option of color.chart.danger.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.danger.bold.',
            },
          },
        },
      },
      warning: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                "For data visualisation communicating caution, such as 'at risk' statuses.",
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.warning.',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'A stronger emphasis option of color.chart.warning.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.warning.bold.',
            },
          },
        },
      },
      information: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation communicating low priority or in-progress statuses.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.information.',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'A stronger emphasis option of color.chart.information.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.information.bold.',
            },
          },
        },
      },
      discovery: {
        '[default]': {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                "For data visualisation communicating 'new' statuses.",
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.discovery.',
            },
          },
        },
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'A stronger emphasis option of color.chart.discovery.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.discovery.bold.',
            },
          },
        },
      },

      categorical: {
        1: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation only. Follow numbered sequence.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.categorical.1.',
            },
          },
        },
        2: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation only. Follow numbered sequence.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.categorical.2.',
            },
          },
        },
        3: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation only. Follow numbered sequence.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.categorical.3.',
            },
          },
        },
        4: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation only. Follow numbered sequence.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.categorical.4.',
            },
          },
        },
        5: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation only. Follow numbered sequence.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.categorical.5.',
            },
          },
        },
        6: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation only. Follow numbered sequence.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.categorical.6.',
            },
          },
        },
        7: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation only. Follow numbered sequence.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.categorical.7.',
            },
          },
        },
        8: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description:
                'For data visualisation only. Follow numbered sequence.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.categorical.8.',
            },
          },
        },
      },

      blue: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.blue.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.blue.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.blue.boldest.',
            },
          },
        },
      },
      red: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.red.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.red.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.red.boldest.',
            },
          },
        },
      },
      orange: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.orange.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.orange.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.orange.boldest.',
            },
          },
        },
      },
      yellow: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.yellow.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.yellow.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.yellow.boldest.',
            },
          },
        },
      },
      green: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.green.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.green.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.green.boldest.',
            },
          },
        },
      },
      teal: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.teal.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.teal.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.teal.boldest.',
            },
          },
        },
      },
      purple: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.purple.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.purple.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.purple.boldest.',
            },
          },
        },
      },
      magenta: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.magenta.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.magenta.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.magenta.boldest.',
            },
          },
        },
      },
      lime: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.lime.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.lime.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.lime.boldest.',
            },
          },
        },
      },
      gray: {
        bold: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.gray.bold.',
            },
          },
        },
        bolder: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.gray.bolder.',
            },
          },
        },
        boldest: {
          '[default]': {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'For data visualisation only.',
            },
          },
          hovered: {
            attributes: {
              group: 'paint',
              state: 'active',
              introduced: '0.13.3',
              description: 'Hovered state of color.chart.gray.boldest.',
            },
          },
        },
      },
    },
  },
};

export default color;
