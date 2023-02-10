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
};

export default spacing;
