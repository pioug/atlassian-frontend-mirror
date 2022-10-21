import type { BaseToken } from '../../../palettes/spacing-scale';
import type { AttributeSchema, SpacingTokenSchema } from '../../../types';
const spacing: AttributeSchema<SpacingTokenSchema<BaseToken>> = {
  spacing: {
    container: {
      gutter: {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '8px',
          introduced: '0.10.16',
          description:
            'Helpful guidance goes here. This is an example of a more semantic token over the top of our scale. It uses the same underlying base tokens as the scale.x tokens use.',
        },
      },
    },
    scale: {
      '0': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '0',
          introduced: '0.10.16',
          description:
            'Equates to `0`. Can be used for resetting default spacing styles.',
        },
      },
      '025': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '2px',
          introduced: '0.10.16',
          description:
            'Use for spacing in compact scenarios. The smallest value in our scale.',
        },
      },
      '050': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '4px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '075': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '6px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '100': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '8px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '150': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '12px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '200': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '16px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '250': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '20px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '300': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '24px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '400': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '32px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '500': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '40px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
      '600': {
        attributes: {
          group: 'spacing',
          state: 'experimental',
          replacement: '48px',
          introduced: '0.10.16',
          description: 'Helpful guidance goes here',
        },
      },
    },
  },
};
export default spacing;
