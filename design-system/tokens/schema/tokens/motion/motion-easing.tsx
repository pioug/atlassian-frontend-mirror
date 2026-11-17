import type { AttributeSchema, MotionEasingTokenSchema } from '../../../src/types';
import type { BaseEasingToken } from '../../palettes/motion-palette';

const easing: AttributeSchema<MotionEasingTokenSchema<BaseEasingToken>> = {
	motion: {
		easing: {
			out: {
				expo: {
					attributes: {
						group: 'motionEasing',
						state: 'active',
						introduced: '20.12.0',
						description:
							'Use for floating controls following a panel entrance, with fast acceleration and a soft landing.',
					},
				},
				quart: {
					attributes: {
						group: 'motionEasing',
						state: 'active',
						introduced: '20.12.0',
						description:
							'Use for floating controls following a panel exit, moving immediately and easing to rest.',
					},
				},
				bold: {
					attributes: {
						group: 'motionEasing',
						state: 'active',
						introduced: '11.5.0',
						description:
							'Elements arrive quickly and decelerate to a stop. The fast start grabs attention and the gentle landing feels controlled.',
					},
				},
				practical: {
					attributes: {
						group: 'motionEasing',
						state: 'active',
						introduced: '11.5.0',
						description:
							'A practical, everyday enter curve. Less dramatic than the bold variant, good for subtle transitions like content swaps, tab changes, and list reordering.',
					},
				},
			},
			in: {
				practical: {
					attributes: {
						group: 'motionEasing',
						state: 'active',
						introduced: '11.5.0',
						description:
							'Starts slowly and accelerates away. Best for exit transitions where elements leaving the screen should feel like they are getting out of the way.',
					},
				},
			},
			inout: {
				bold: {
					attributes: {
						group: 'motionEasing',
						state: 'active',
						introduced: '11.5.0',
						description:
							'The bold in-out curve pairs naturally with scale and repositioning of elements. It controls both the start and end of the motion.',
					},
				},
			},
			spring: {
				attributes: {
					group: 'motionEasing',
					state: 'experimental',
					introduced: '11.5.0',
					description:
						'A spring curve that overshoots slightly before settling. Use for playful, tactile feedback on small branded elements such as avatar hover, where the slight overshoot reinforces a sense of life.',
				},
			},
		},
	},
};

export default easing;
