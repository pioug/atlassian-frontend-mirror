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
			'[default]': {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '19.0.0',
					description: 'Use for input hover, focus, and error state transitions.',
				},
			},
			toggle: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '20.5.0',
					description: 'Use for toggle track colour, handle slide and icon transitions.',
				},
			},
			selection: {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '20.2.0',
					description:
						'Use for checkbox and radio surface, border and indicator state cross-fades.',
				},
			},
		},
		form: {
			message: {
				enter: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '20.1.0',
						description: 'Use when a form message enters.',
					},
				},
				exit: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '20.1.0',
						description: 'Use when a form message exits.',
					},
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
		floating: {
			controls: {
				follow: {
					panel: {
						enter: {
							attributes: {
								group: 'motion',
								state: 'active',
								introduced: '20.12.0',
								description:
									'Use as a CSS transform transition for floating controls that follow an entering panel. Translate horizontally by the panel width when opening begins, reversing direction for RTL. Keeps movement independent of page layout. Does not include vertical movement or visibility changes.',
							},
						},
						exit: {
							attributes: {
								group: 'motion',
								state: 'active',
								introduced: '20.12.0',
								description:
									'Use as a CSS transform transition for floating controls that follow an exiting panel. Restore the horizontal translation when closing begins. Does not include vertical movement or visibility changes. Disable the transition during manual panel resizing.',
							},
						},
					},
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
				open: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '20.12.0',
						description:
							'Use to fade in content when a panel opens. Includes a delay to coordinate with the panel entrance animation. For replacement content in an open panel, use motion.panel.content.enter.',
					},
				},
				enter: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.6.0',
						description:
							'Use to fade in replacement content within an open panel, without an opening delay. For content appearing when the panel opens, use motion.panel.content.open.',
					},
				},
				exit: {
					attributes: {
						group: 'motion',
						state: 'active',
						introduced: '16.6.0',
						description:
							'Use to fade out panel content before it is replaced or as the panel closes. This animates the content; use motion.panel.exit to animate the panel surface.',
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
		tab: {
			'[default]': {
				attributes: {
					group: 'motion',
					state: 'active',
					introduced: '18.3.0',
					description: 'Use for tab text color and neutral indicator opacity transitions.',
				},
			},
			indicator: {
				enter: {
					left: {
						attributes: {
							group: 'motion',
							state: 'active',
							introduced: '18.3.0',
							description: 'Use for tab indicators entering from the left.',
						},
					},
					right: {
						attributes: {
							group: 'motion',
							state: 'active',
							introduced: '18.3.0',
							description: 'Use for tab indicators entering from the right.',
						},
					},
				},
				exit: {
					left: {
						attributes: {
							group: 'motion',
							state: 'active',
							introduced: '18.3.0',
							description: 'Use for tab indicators exiting toward the left.',
						},
					},
					right: {
						attributes: {
							group: 'motion',
							state: 'active',
							introduced: '18.3.0',
							description: 'Use for tab indicators exiting toward the right.',
						},
					},
				},
			},
		},
	},
};
export default motion;
