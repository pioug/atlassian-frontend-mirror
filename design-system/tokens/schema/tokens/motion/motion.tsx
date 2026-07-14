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
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '15.5.0',
					description: 'Use for panel enter transitions.',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '15.5.0',
					description: 'Use for panel exit transitions.',
				},
			},
		},
	},
};
export default motion;
