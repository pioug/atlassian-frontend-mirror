import type { BaseToken } from '../../../palettes/spacing-scale';
import type { AttributeSchema, SpacingTokenSchema } from '../../../types';

const spacing: AttributeSchema<SpacingTokenSchema<BaseToken>> = {
  spacing: {
    scale: {
      '0': {
        attributes: {
          group: 'spacing',
          state: 'active',
          introduced: '0.10.16',
          description:
            'Equates to `0`. Can be used for resetting default spacing styles.',
        },
      },
      '025': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['1px', '3px'],
          introduced: '0.10.16',
          description:
            'Use for spacing in compact scenarios. The smallest value in our scale.',
        },
      },
      '050': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['3px', '5px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '075': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['5px', '7px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '100': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['7px', '9px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '150': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['10px', '11px', '13px', '14px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '200': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['14px', '15px', '17px', '18px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '250': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['19px', '21px', '22px', '23px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '300': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['23px', '25px', '26px', '27px', '28px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '400': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['28px', '29px', '30px', '31px', '33px', '34px', '35px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '500': {
        attributes: {
          group: 'spacing',
          state: 'active',
          suggest: ['28px', '29px', '30px', '31px', '33px', '34px', '35px'],
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '600': {
        attributes: {
          group: 'spacing',
          state: 'active',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
    },
    scaleLinear: {
      '0': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '0',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '100': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '2px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '200': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '4px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '300': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '6px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '400': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '8px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '500': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '12px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '600': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '16px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '700': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '20px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '800': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '24px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '900': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '32px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '1000': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '40px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '1100': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '48px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
    },
    pixel: {
      '0': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '0',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '2': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '2px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '4': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '4px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '6': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '6px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '8': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '8px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '12': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '12px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '16': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '16px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '20': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '20px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '24': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '24px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '32': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '32px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '40': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '40px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      '48': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '48px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
    },
    size: {
      none: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '0',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      xxxxSmall: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '2px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      xxxSmall: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '4px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      xxSmall: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '6px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      xsmall: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '8px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      small: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '12px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      medium: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '16px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      large: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '20px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      xlarge: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '24px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      xxlarge: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '32px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      xxxlarge: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '40px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      xxxxlarge: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '48px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
    },
    ecl: {
      element: {
        '2': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '2px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '4': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '4px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '6': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '6px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '8': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '8px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
      },
      container: {
        '12': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '12px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '16': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '16px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '20': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '20px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '24': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '24px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
      },
      layout: {
        '32': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '32px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '40': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '40px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '64': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '64px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
      },
    },
    ccc: {
      component: {
        '2': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '2px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '4': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '4px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '6': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '6px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '8': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '8px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
      },
      content: {
        '12': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '12px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '16': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '16px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '20': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '20px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '24': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '24px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
      },
      container: {
        '32': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '32px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '40': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '40px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
        '48': {
          attributes: {
            group: 'spacing',
            state: 'experimental',
            replacement: '48px',
            introduced: '0.10.28',
            description: 'Helpful guidance goes here',
          },
        },
      },
    },
    gap: {
      100: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '8px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      200: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '16px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      300: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '24px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
    },
    inset: {
      100: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '8px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      200: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '16px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
      300: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '24px',
          introduced: '0.10.28',
          description: 'Helpful guidance goes here',
        },
      },
    },
  },
};
export default spacing;
