import type { AttributeSchema, MotionTokenSchema } from '../../../src/types';
import type { MotionPaletteToken } from '../../palettes/motion-palette';

const motion: AttributeSchema<MotionTokenSchema<MotionPaletteToken>> = {
	motion: {
		dialog: {
			enter: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.1.0',
					description: '',
				},
			},
			exit: {
				attributes: {
					group: 'motion',
					state: 'experimental',
					introduced: '11.1.0',
					description: '',
				},
			},
		},
		content: {
			enter: {
				short: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.1.0',
						description: '',
					},
				},
				medium: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.1.0',
						description: '',
					},
				},
				long: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.1.0',
						description: '',
					},
				},
			},
			exit: {
				short: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.1.0',
						description: '',
					},
				},
				medium: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.1.0',
						description: '',
					},
				},
				long: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '11.1.0',
						description: '',
					},
				},
			},
		},
	},
};
export default motion;
