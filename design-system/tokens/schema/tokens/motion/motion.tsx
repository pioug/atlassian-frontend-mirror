import type { AttributeSchema, MotionTokenSchema } from '../../../src/types';
import type { MotionPaletteToken } from '../../palettes/motion-palette';

const motion: AttributeSchema<MotionTokenSchema<MotionPaletteToken>> = {
	motion: {
		avatar: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
			hovered: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
		},
		blanket: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.5.0',
					description: '',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.5.0',
					description: '',
				},
			},
		},
		flag: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
			reposition: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
		},
		modal: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
		},
		popup: {
			enter: {
				top: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.2.0',
						description: '',
					},
				},
				bottom: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.2.0',
						description: '',
					},
				},
				left: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.2.0',
						description: '',
					},
				},
				right: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.2.0',
						description: '',
					},
				},
			},
			exit: {
				top: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.2.0',
						description: '',
					},
				},
				bottom: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.2.0',
						description: '',
					},
				},
				left: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.2.0',
						description: '',
					},
				},
				right: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.2.0',
						description: '',
					},
				},
			},
		},
		spotlight: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.2.0',
					description: '',
				},
			},
		},
	},
};
export default motion;
