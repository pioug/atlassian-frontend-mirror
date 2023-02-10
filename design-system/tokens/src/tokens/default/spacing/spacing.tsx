import type { AttributeSchema, SpacingTokenSchema } from '../../../types';

/**
 * The spacing attribute schema governs the non-value specific metadata to apply to the
 * spacing theme. This governs the name, description and state
 * of a token.
 */
const spacing: AttributeSchema<SpacingTokenSchema> = {
  space: {
    '0': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        pixelValue: '0px',
        description:
          'Equates to `0`. Can be used for resetting default spacing styles.',
      },
    },
    '025': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['1px', '3px'],
        introduced: '0.12.0',
        pixelValue: '2px',
        description:
          'Use for spacing in compact scenarios. The smallest value in our scale.',
      },
    },
    '050': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['3px', '5px'],
        introduced: '0.12.0',
        pixelValue: '4px',
        description: 'Use for spacing in compact scenarios.',
      },
    },
    '075': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['5px', '7px'],
        introduced: '0.12.0',
        pixelValue: '6px',
        description: 'Use for spacing in compact scenarios.',
      },
    },
    '100': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['7px', '9px'],
        introduced: '0.12.0',
        pixelValue: '8px',
        description: 'Use for gutter spacing.',
      },
    },
    '150': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['10px', '11px', '13px', '14px'],
        introduced: '0.12.0',
        pixelValue: '12px',
        description: 'Helpful guidance goes here',
      },
    },
    '200': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['14px', '15px', '17px', '18px'],
        introduced: '0.12.0',
        pixelValue: '16px',
        description: 'Use for gutter spacing.',
      },
    },
    '250': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['19px', '21px', '22px', '23px'],
        introduced: '0.12.0',
        pixelValue: '20px',
        description: 'Use for gutter spacing.',
      },
    },
    '300': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['23px', '25px', '26px', '27px', '28px'],
        introduced: '0.12.0',
        pixelValue: '24px',
        description: 'Use for gutter spacing.',
      },
    },
    '400': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['28px', '29px', '30px', '31px', '33px', '34px', '35px'],
        introduced: '0.12.0',
        pixelValue: '32px',
        description: 'Use for gutter spacing.',
      },
    },
    '500': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        pixelValue: '40px',
        description: 'Use for larger layout-specific spacing.',
      },
    },
    '600': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        pixelValue: '48px',
        description: 'Use for larger layout-specific spacing.',
      },
    },
    '800': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        pixelValue: '64px',
        description: 'Use for larger layout-specific spacing.',
      },
    },
    '1000': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        pixelValue: '80px',
        description: 'Use for larger layout-specific spacing.',
      },
    },
  },
};
export default spacing;
