import type { AttributeSchema, TextColorTokenSchema } from '../../../src/types';
import type { BaseToken } from '../../palettes/palette';

const color: AttributeSchema<TextColorTokenSchema<BaseToken>> = {
	color: {
		text: {
			'[default]': {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description:
						'Use for primary text, such as body copy, sentence case headers, and buttons.',
				},
			},
			subtle: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description:
						'Use for secondary text, such as navigation, subtle button links, input field labels, and all caps subheadings.',
				},
			},
			subtlest: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description:
						'Use for tertiary text, such as meta-data, breadcrumbs, input field placeholder and helper text.',
				},
			},
			disabled: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.0.15',
					description: 'Use for text in a disabled state.',
				},
			},
			inverse: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description: 'Use for text on bold backgrounds.',
				},
			},
			brand: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description: 'Use for text that reinforces our brand.',
				},
			},
			selected: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description:
						'Use for text in selected or opened states, such as tabs and dropdown buttons.',
				},
			},
			danger: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.0.15',
						description: 'Use for critical text, such as input field error messaging.',
					},
				},
				bolder: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '8.1.0',
						description:
							'Use for text on top of danger semantic labels to ensure accessibility and desired visual appearance.',
					},
				},
			},
			warning: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.0.15',
						description: 'Use for text to emphasize caution, such as in moved lozenges.',
					},
				},
				inverse: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.6.0',
						description: 'Use for text when on bold warning backgrounds.',
					},
				},
				bolder: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '8.1.0',
						description:
							'Use for text on top of warning semantic labels to ensure accessibility and desired visual appearance.',
					},
				},
			},
			success: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.0.15',
						description:
							'Use for text to communicate a favorable outcome, such as input field success messaging.',
					},
				},
				bolder: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '8.1.0',
						description:
							'Use for text on top of success semantic labels to ensure accessibility and desired visual appearance.',
					},
				},
			},
			discovery: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.0.15',
						description:
							'Use for text to emphasize change or something new, such as in new lozenges.',
					},
				},
				bolder: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '8.1.0',
						description:
							'Use for text on top of discovery semantic labels to ensure accessibility and desired visual appearance.',
					},
				},
			},
			information: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '0.6.0',
						description:
							'Use for informative text or to communicate something is in progress, such as in-progress lozenges.',
					},
				},
				bolder: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '8.1.0',
						description:
							'Use for text on top of information semantic labels to ensure accessibility and desired visual appearance.',
					},
				},
			},
		},
		link: {
			'[default]': {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description:
						'Use for links in a default or hovered state. Add an underline for hovered states.',
				},
			},
			pressed: {
				attributes: {
					group: 'paint',
					state: 'active',
					introduced: '0.6.0',
					description: 'Use for links in a pressed state.',
				},
			},
			visited: {
				'[default]': {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '1.23.0',
						description: 'Use for visited links.',
					},
				},
				pressed: {
					attributes: {
						group: 'paint',
						state: 'active',
						introduced: '1.43.0',
						description: 'Use for visited links in a pressed state.',
					},
				},
			},
		},
	},
};

export default color;
