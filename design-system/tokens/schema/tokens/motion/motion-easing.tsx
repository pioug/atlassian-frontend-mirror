import type { AttributeSchema, MotionEasingTokenSchema } from '../../../src/types';
import type { BaseEasingToken } from '../../palettes/motion-palette';

const font: AttributeSchema<MotionEasingTokenSchema<BaseEasingToken>> = {
	motion: {
		easing: {
			out: {
				bold: {
					attributes: {
						group: 'motionEasing',
						state: 'experimental',
						introduced: '11.5.0',
						description: '',
					},
				},
				practical: {
					attributes: {
						group: 'motionEasing',
						state: 'experimental',
						introduced: '11.5.0',
						description: '',
					},
				},
			},
			in: {
				practical: {
					attributes: {
						group: 'motionEasing',
						state: 'experimental',
						introduced: '11.5.0',
						description: '',
					}
				}
			},
			inout: {
				bold: {
					attributes: {
						group: 'motionEasing',
						state: 'experimental',
						introduced: '11.5.0',
						description: '',
					},
				}
			},
			spring: {
				attributes: {
					group: 'motionEasing',
					state: 'experimental',
					introduced: '11.5.0',
					description: '',
				},
			}
		},
	},
};

export default font;
