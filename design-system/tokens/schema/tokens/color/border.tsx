import type { AttributeSchema, BorderColorTokenSchema } from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const color: AttributeSchema<BorderColorTokenSchema<BaseToken>> = {
	color: {
		border: {
			'[default]': {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description:
						'Use to visually group or separate UI elements, such as flat cards or side panel dividers.',
				},
			},
			bold: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.10.8',
					description: 'A neutral border option that passes min 3:1 contrast ratios.',
				},
			},
			inverse: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description: 'Use for borders on bold backgrounds.',
				},
			},
			focused: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description: 'Use for focus rings of elements in a focus state.',
				},
			},
			input: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description:
						'Use for borders of form UI elements, such as text fields, checkboxes, and radio buttons.',
				},
			},
			disabled: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description: 'Use for borders of elements in a disabled state.',
				},
			},
			brand: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description:
						'Use for borders or visual indicators of elements that reinforce our brand, such as logos or primary buttons.',
				},
			},
			selected: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.2',
					description:
						'Use for borders or visual indicators of elements in a selected or opened state, such as in tabs or menu items.',
				},
			},
			danger: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.6.0',
						description:
							'Use for borders communicating critical information, such as the borders on invalid text fields.',
					},
				},
				subtle: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '13.2.0',
						description:
							'Use for decorative danger borders that do not need to meet 3:1 contrast requirements.',
					},
				},
			},
			warning: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.6.0',
						description: 'Use for borders communicating caution.',
					},
				},
				subtle: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '13.2.0',
						description:
							'Use for decorative warning borders that do not need to meet 3:1 contrast requirements.',
					},
				},
			},
			success: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.6.0',
						description:
							'Use for borders communicating a favorable outcome, such as the borders on validated text fields.',
					},
				},
				subtle: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '13.2.0',
						description:
							'Use for decorative success borders that do not need to meet 3:1 contrast requirements.',
					},
				},
			},
			discovery: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.6.0',
						description:
							'Use for borders communicating change or something new, such as the borders in onboarding spotlights.',
					},
				},
				subtle: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '13.2.0',
						description:
							'Use for decorative discovery borders that do not need to meet 3:1 contrast requirements.',
					},
				},
			},
			information: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.6.0',
						description: 'Use for borders communicating information or something in-progress.',
					},
				},
				subtle: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '13.2.0',
						description:
							'Use for decorative information borders that do not need to meet 3:1 contrast requirements.',
					},
				},
			},
		},
	},
};

export default color;
