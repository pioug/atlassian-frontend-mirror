import type { SpacingTokenSchema, ValueSchema } from '../../../src/types';
import type { SpacingPaletteToken } from '../../palettes/spacing-scale';

/**
 * The spacing value schema is specifically designed to dictate the
 * possible values a specific key-token pair will have.
 *
 * This is combined with the attribute schema.
 * @link 'file:../default/spacing/spacing.tsx'
 */
const spacing: ValueSchema<SpacingTokenSchema<SpacingPaletteToken>> = {
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
		gap: {
			xxsmall: { value: 'Space025' },
			xsmall: { value: 'Space050' },
			small: { value: 'Space075' },
			medium: { value: 'Space100' },
			large: { value: 'Space150' },
			xlarge: { value: 'Space200' },
			xxlarge: { value: 'Space300' },
		},
		inset: {
			xxsmall: { value: 'Space050' },
			xsmall: { value: 'Space100' },
			small: { value: 'Space150' },
			medium: { value: 'Space200' },
			large: { value: 'Space250' },
			xlarge: { value: 'Space300' },
			xxlarge: { value: 'Space400' },
			'3xlarge': { value: 'Space600' },
		},
		negative: {
			'025': { value: 'SpaceNegative025' },
			'050': { value: 'SpaceNegative050' },
			'075': { value: 'SpaceNegative075' },
			'100': { value: 'SpaceNegative100' },
			'150': { value: 'SpaceNegative150' },
			'200': { value: 'SpaceNegative200' },
			'250': { value: 'SpaceNegative250' },
			'300': { value: 'SpaceNegative300' },
			'400': { value: 'SpaceNegative400' },
		},
	},
};

export default spacing;
