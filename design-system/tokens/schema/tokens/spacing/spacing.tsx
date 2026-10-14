import type { AttributeSchema, SpacingTokenSchema } from '../../../src/types';
import type { SpacingPaletteToken } from '../../palettes/spacing-scale';

/**
 * The spacing attribute schema governs the non-value specific metadata to apply to the
 * spacing theme. This governs the name, description and state
 * of a token.
 */
const spacing: AttributeSchema<SpacingTokenSchema<SpacingPaletteToken>> = {
	space: {
		'0': {
			attributes: {
				group: 'spacing',
				state: 'active',
				introduced: '0.12.0',
				description: 'Equates to `0`. Use for resetting default spacing styles.',
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
				description: 'Use for the largest pieces of UI and for layout elements.',
			},
		},
		'500': {
			attributes: {
				group: 'spacing',
				state: 'active',
				introduced: '0.12.0',
				description: 'Use for the largest pieces of UI and for layout elements.',
			},
		},
		'600': {
			attributes: {
				group: 'spacing',
				state: 'active',
				introduced: '0.12.0',
				description: 'Use for the largest pieces of UI and for layout elements.',
			},
		},
		'800': {
			attributes: {
				group: 'spacing',
				state: 'active',
				introduced: '0.12.0',
				description: 'Use for the largest pieces of UI and for layout elements.',
			},
		},
		'1000': {
			attributes: {
				group: 'spacing',
				state: 'active',
				introduced: '0.12.0',
				description: 'Use for the largest pieces of UI and for layout elements.',
			},
		},
		gap: {
			xxsmall: {
				attributes: {
					group: 'spacing',
					state: 'experimental',
					replacement: 'space.025',
					introduced: '20.5.0',
					description:
						'Use for the smallest gaps between closely related elements. Do not use for component insets or dimensions.',
				},
			},
			xsmall: {
				attributes: {
					group: 'spacing',
					state: 'experimental',
					replacement: 'space.050',
					introduced: '20.5.0',
					description:
						'Use for extra-small gaps between closely related elements. Do not use for component insets or dimensions.',
				},
			},
			small: {
				attributes: {
					group: 'spacing',
					state: 'experimental',
					replacement: 'space.075',
					introduced: '20.5.0',
					description:
						'Use for small gaps between related elements, such as icons and text. Do not use for component insets or dimensions.',
				},
			},
			medium: {
				attributes: {
					group: 'spacing',
					state: 'experimental',
					replacement: 'space.100',
					introduced: '20.5.0',
					description:
						'Use for medium gaps between related elements in horizontal or vertical layouts. Do not use for component insets or dimensions.',
				},
			},
			large: {
				attributes: {
					group: 'spacing',
					state: 'experimental',
					replacement: 'space.150',
					introduced: '20.5.0',
					description:
						'Use for large gaps between elements in horizontal or vertical layouts. Do not use for component insets or dimensions.',
				},
			},
			xlarge: {
				attributes: {
					group: 'spacing',
					state: 'experimental',
					replacement: 'space.200',
					introduced: '20.5.0',
					description:
						'Use for extra-large gaps between elements or groups of related content. Do not use for component insets or dimensions.',
				},
			},
			xxlarge: {
				attributes: {
					group: 'spacing',
					state: 'experimental',
					replacement: 'space.300',
					introduced: '20.5.0',
					description:
						'Use for the largest gaps between groups of related content. Do not use for component insets or dimensions.',
				},
			},
		},
		negative: {
			'025': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-1px', '-3px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap small pieces of UI.',
				},
			},
			'050': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-3px', '-5px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap small pieces of UI.',
				},
			},
			'075': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-5px', '-7px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap small pieces of UI.',
				},
			},
			'100': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-7px', '-9px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap small pieces of UI.',
				},
			},
			'150': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-10px', '-11px', '-13px', '-14px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap larger pieces of UI.',
				},
			},
			'200': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-14px', '-15px', '-17px', '-18px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap larger pieces of UI.',
				},
			},
			'250': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-19px', '-21px', '-22px', '-23px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap larger pieces of UI.',
				},
			},
			'300': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-23px', '-25px', '-26px', '-27px', '-28px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap larger pieces of UI.',
				},
			},
			'400': {
				attributes: {
					group: 'spacing',
					state: 'active',
					suggest: ['-28px', '-29px', '-30px', '-31px', '-33px', '-34px', '-35px'],
					introduced: '1.21.0',
					description: 'Use to negate parent whitespace or overlap the largest pieces of UI.',
				},
			},
		},
	},
};
export default spacing;
