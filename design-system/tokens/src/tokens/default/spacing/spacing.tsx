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
        description:
          'Equates to `0`. Use for resetting default spacing styles.',
      },
    },
    '025': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['1px', '3px'],
        introduced: '0.12.0',
        description: 'Use for small and compact pieces of UI.',
      },
    },
    '050': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['3px', '5px'],
        introduced: '0.12.0',
        description: 'Use for small and compact pieces of UI.',
      },
    },
    '075': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['5px', '7px'],
        introduced: '0.12.0',
        description: 'Use for small and compact pieces of UI.',
      },
    },
    '100': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['7px', '9px'],
        introduced: '0.12.0',
        description: 'Use for small and compact pieces of UI.',
      },
    },
    '150': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['10px', '11px', '13px', '14px'],
        introduced: '0.12.0',
        description: 'Use for larger and less dense pieces of UI.',
      },
    },
    '200': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['14px', '15px', '17px', '18px'],
        introduced: '0.12.0',
        description: 'Use for larger and less dense pieces of UI.',
      },
    },
    '250': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['19px', '21px', '22px', '23px'],
        introduced: '0.12.0',
        description: 'Use for larger and less dense pieces of UI.',
      },
    },
    '300': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['23px', '25px', '26px', '27px', '28px'],
        introduced: '0.12.0',
        description: 'Use for larger and less dense pieces of UI.',
      },
    },
    '400': {
      attributes: {
        group: 'spacing',
        state: 'active',
        suggest: ['28px', '29px', '30px', '31px', '33px', '34px', '35px'],
        introduced: '0.12.0',
        description:
          'Use for the largest pieces of UI and for layout elements.',
      },
    },
    '500': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        description:
          'Use for the largest pieces of UI and for layout elements.',
      },
    },
    '600': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        description:
          'Use for the largest pieces of UI and for layout elements.',
      },
    },
    '800': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        description:
          'Use for the largest pieces of UI and for layout elements.',
      },
    },
    '1000': {
      attributes: {
        group: 'spacing',
        state: 'active',
        introduced: '0.12.0',
        description:
          'Use for the largest pieces of UI and for layout elements.',
      },
    },
  },
};
export default spacing;
