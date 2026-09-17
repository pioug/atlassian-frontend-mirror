import type { AttributeSchema, MotionTokenSchema } from '../../../src/types';
import type { MotionPaletteToken } from '../../palettes/motion-palette';

const motion: AttributeSchema<MotionTokenSchema<MotionPaletteToken>> = {
	motion: {
		avatar: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for avatar group enter transitions.',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for avatar group exit transitions.',
				},
			},
			hovered: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for hover state on avatar elements.',
				},
			},
		},
		button: {
			hovered: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '15.1.0',
					description: 'Use for button hover state transitions.',
				},
			},
			pressed: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '15.1.0',
					description: 'Use for button pressed state transitions.',
				},
			},
		},
		input: {
			hovered: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '17.1.0',
					description: 'Use for input hover and return-to-rest state transitions.',
				},
			},
			focused: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '17.1.0',
					description: 'Use for input focus state transitions.',
				},
			},
		},
		listitem: {
			hovered: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '15.4.0',
					description: 'Use for list item hover state transitions.',
				},
			},
			pressed: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '15.4.0',
					description: 'Use for list item pressed state transitions.',
				},
			},
			selected: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '15.4.0',
					description: 'Use for list item selected state transitions.',
				},
			},
		},
		blanket: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.5.0',
					description: 'Use for blanket enter transitions.',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.5.0',
					description: 'Use for blanket exit transitions.',
				},
			},
		},
		flag: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for flag enter transitions.',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for flag exit transitions.',
				},
			},
			reposition: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for repositioning flag elements.',
				},
			},
		},
		modal: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for modal enter transitions.',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for modal exit transitions.',
				},
			},
		},
		popup: {
			enter: {
				top: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '11.2.0',
						description:
							'Use for popup enter from the top: popup, tooltip, dropdown, inline message, inline dialog.',
					},
				},
				bottom: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '11.2.0',
						description: 'Use for popup enter from the bottom.',
					},
				},
				left: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '11.2.0',
						description: 'Use for popup enter from the left.',
					},
				},
				right: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '11.2.0',
						description: 'Use for popup enter from the right.',
					},
				},
			},
			exit: {
				top: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '11.2.0',
						description: 'Use for popup exit toward the top.',
					},
				},
				bottom: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '11.2.0',
						description: 'Use for popup exit toward the bottom.',
					},
				},
				left: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '11.2.0',
						description: 'Use for popup exit toward the left.',
					},
				},
				right: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '11.2.0',
						description: 'Use for popup exit toward the right.',
					},
				},
			},
		},
		spotlight: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for spotlight enter transitions.',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '11.2.0',
					description: 'Use for spotlight exit transitions.',
				},
			},
		},
		panel: {
			enter: {
				'[default]': {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '15.5.0',
						description: 'Use for panel enter transitions.',
					},
				},
				left: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.6.0',
						description: 'Use for panel enter from the left.',
					},
				},
				right: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.6.0',
						description: 'Use for panel enter from the right.',
					},
				},
			},
			exit: {
				'[default]': {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '15.5.0',
						description: 'Use for panel exit transitions.',
					},
				},
				left: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.6.0',
						description: 'Use for panel exit towards the left.',
					},
				},
				right: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.6.0',
						description: 'Use for panel exit towards the right.',
					},
				},
			},
			content: {
				enter: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.6.0',
						description: 'Use for panel content enter.',
					},
				},
				exit: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.6.0',
						description: 'Use for panel content exit.',
					},
				},
			},
		},
		sidenav: {
			enter: {
				left: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.4.0',
						description: 'Use for side nav enter from the left.',
					},
				},
				right: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.4.0',
						description: 'Use for side nav enter from the right.',
					},
				},
			},
			exit: {
				left: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.4.0',
						description: 'Use for side nav exit towards the left.',
					},
				},
				right: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.4.0',
						description: 'Use for side nav exit towards the right.',
					},
				},
			},
		},
		label: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '16.5.0',
					description: 'Use for label enter transitions (e.g. tag component).',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '16.5.0',
					description: 'Use for label exit transitions (e.g. tag component).',
				},
			},
		},
	},
};
export default motion;
