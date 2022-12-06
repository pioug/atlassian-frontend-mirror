import type { SpacingTokenSchema, ValueSchema } from '../../types';

/**
 * The spacing value schema is specifically designed to dictate the
 * possible values a specific key-token pair will have.
 *
 * This is combined with the attribute schema.
 * @link 'file:../default/spacing/spacing.tsx'
 */
const spacing: ValueSchema<SpacingTokenSchema> = {
  space: {
    '0': { value: 'Space0' },
    '025': { value: 'Space025' },
    '050': { value: 'Space050' },
    '075': { value: 'Space075' },
    '100': { value: 'Space100' },
    '150': { value: 'Space150' },
    '200': { value: 'Space200' },
    '250': { value: 'Space250' },
    '300': { value: 'Space300' },
    '400': { value: 'Space400' },
    '500': { value: 'Space500' },
    '600': { value: 'Space600' },
    '800': { value: 'Space800' },
    '1000': { value: 'Space1000' },
  },
  // original namespace under 'spacing' this is the same as above
  spacing: {
    scale: {
      '0': { value: 'Space0' },
      '025': { value: 'Space025' },
      '050': { value: 'Space050' },
      '075': { value: 'Space075' },
      '100': { value: 'Space100' },
      '150': { value: 'Space150' },
      '200': { value: 'Space200' },
      '250': { value: 'Space250' },
      '300': { value: 'Space300' },
      '400': { value: 'Space400' },
      '500': { value: 'Space500' },
      '600': { value: 'Space600' },
      '800': { value: 'Space800' },
      '1000': { value: 'Space1000' },
    },
    scaleLinear: {
      '0': { value: 'Space0' },
      '100': { value: 'Space025' },
      '200': { value: 'Space050' },
      '300': { value: 'Space075' },
      '400': { value: 'Space100' },
      '500': { value: 'Space150' },
      '600': { value: 'Space200' },
      '700': { value: 'Space250' },
      '800': { value: 'Space300' },
      '900': { value: 'Space400' },
      '1000': { value: 'Space500' },
      '1100': { value: 'Space600' },
    },
    size: {
      none: { value: 'Space0' },
      xxxxSmall: { value: 'Space025' },
      xxxSmall: { value: 'Space050' },
      xxSmall: { value: 'Space075' },
      xsmall: { value: 'Space100' },
      small: { value: 'Space150' },
      medium: { value: 'Space200' },
      large: { value: 'Space250' },
      xlarge: { value: 'Space300' },
      xxlarge: { value: 'Space400' },
      xxxlarge: { value: 'Space500' },
      xxxxlarge: { value: 'Space600' },
    },
    ecl: {
      element: {
        '2': { value: 'Space025' },
        '4': { value: 'Space050' },
        '6': { value: 'Space075' },
        '8': { value: 'Space100' },
      },
      container: {
        '12': { value: 'Space150' },
        '16': { value: 'Space200' },
        '20': { value: 'Space250' },
        '24': { value: 'Space300' },
      },
      layout: {
        '32': { value: 'Space400' },
        '40': { value: 'Space500' },
        '64': { value: 'Space600' },
      },
    },
    ccc: {
      component: {
        '2': { value: 'Space025' },
        '4': { value: 'Space050' },
        '6': { value: 'Space075' },
        '8': { value: 'Space100' },
      },
      content: {
        '12': { value: 'Space150' },
        '16': { value: 'Space200' },
        '20': { value: 'Space250' },
        '24': { value: 'Space300' },
      },
      container: {
        '32': { value: 'Space400' },
        '40': { value: 'Space500' },
        '48': { value: 'Space600' },
      },
    },
    gap: {
      '100': { value: 'Space100' },
      '200': { value: 'Space200' },
      '300': { value: 'Space300' },
    },
    inset: {
      '100': { value: 'Space100' },
      '200': { value: 'Space200' },
      '300': { value: 'Space300' },
    },
  },
};

export default spacing;
