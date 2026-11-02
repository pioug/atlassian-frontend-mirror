import type { AttributeSchema, MotionDurationTokenSchema } from '../../../src/types';
import type { BaseDurationToken } from '../../palettes/motion-palette';

const duration: AttributeSchema<MotionDurationTokenSchema<BaseDurationToken>> = {
	motion: {
		duration: {
			instant: {
				attributes: {
					group: 'motionDuration',
					state: 'active',
					introduced: '11.5.0',
					description:
						'Use for instant feedback with no perceptible delay, such as list item hover, selected and focus states.',
				},
			},
			xxshort: {
				attributes: {
					group: 'motionDuration',
					state: 'active',
					introduced: '11.5.0',
					description:
						'Use for instant feedback, such as list item hover, selected and focus states.',
				},
			},
			xshort: {
				attributes: {
					group: 'motionDuration',
					state: 'active',
					introduced: '11.5.0',
					description:
						'Use for subtle pressed states and quick exits, such as component press feedback, popup dismiss, and avatar transitions.',
				},
			},
			short: {
				attributes: {
					group: 'motionDuration',
					state: 'active',
					introduced: '11.5.0',
					description:
						'Use for interactive state emphasis and small entrances, such as button hover and pressed states, popup enter, and avatar appear.',
				},
			},
			medium: {
				attributes: {
					group: 'motionDuration',
					state: 'active',
					introduced: '11.5.0',
					description: 'Use for medium exit transitions, such as modal exit and flag exit.',
				},
			},
			long: {
				attributes: {
					group: 'motionDuration',
					state: 'active',
					introduced: '11.5.0',
					description: 'Use for medium entrance transitions, such as modal enter and flag enter.',
				},
			},
			xlong: {
				attributes: {
					group: 'motionDuration',
					state: 'active',
					introduced: '11.5.0',
					description:
						'Use for large transitions, such as panel enter/exit, page transitions, and full-screen overlays.',
				},
			},
			xxlong: {
				attributes: {
					group: 'motionDuration',
					state: 'active',
					introduced: '11.5.0',
					description:
						'Use for large transitions, such as onboarding steps and full-screen overlays.',
				},
			},
		},
	},
};

export default duration;
