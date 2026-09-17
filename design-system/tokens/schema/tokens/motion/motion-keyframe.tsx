import type { AttributeSchema, MotionKeyframeTokenSchema } from '../../../src/types';
import type { BaseKeyframeToken } from '../../palettes/motion-palette';

const font: AttributeSchema<MotionKeyframeTokenSchema<BaseKeyframeToken>> = {
	motion: {
		keyframe: {
			grid: {
				column: {
					in: {
						attributes: {
							group: 'motionKeyframe',
							state: 'active',
							introduced: '16.5.0',
							description: 'Use to expand an inline grid column from 80% to full size on enter.',
						},
					},
					out: {
						attributes: {
							group: 'motionKeyframe',
							state: 'active',
							introduced: '16.5.0',
							description: 'Use to collapse an inline grid column from full size to zero on exit.',
						},
					},
				},
			},
			scale: {
				in: {
					small: {
						attributes: {
							group: 'motionKeyframe',
							state: 'active',
							introduced: '11.5.0',
							description:
								'Use for small scale-in transitions where an element grows from 95% to full size on enter.',
						},
					},
					medium: {
						attributes: {
							group: 'motionKeyframe',
							state: 'active',
							introduced: '11.5.0',
							description:
								'Use for medium scale-in transitions where an element grows from 80% to full size on enter.',
						},
					},
				},
				out: {
					small: {
						attributes: {
							group: 'motionKeyframe',
							state: 'active',
							introduced: '11.5.0',
							description:
								'Use for small scale-out transitions where an element shrinks from full size to 95% on exit.',
						},
					},
					medium: {
						attributes: {
							group: 'motionKeyframe',
							state: 'active',
							introduced: '11.5.0',
							description:
								'Use for medium scale-out transitions where an element shrinks from full size to 80% on exit.',
						},
					},
				},
			},
			fade: {
				in: {
					attributes: {
						group: 'motionKeyframe',
						state: 'active',
						introduced: '11.5.0',
						description:
							'Use for fade-in transitions where an element goes from fully transparent to fully opaque.',
					},
				},
				out: {
					attributes: {
						group: 'motionKeyframe',
						state: 'active',
						introduced: '11.5.0',
						description:
							'Use for fade-out transitions where an element goes from fully opaque to fully transparent.',
					},
				},
			},
			slide: {
				in: {
					top: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for short slide-in transitions where an element enters from above its final position by 8px.',
							},
						},
					},
					bottom: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for short slide-in transitions where an element enters from below its final position by 8px.',
							},
						},
					},
					left: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for short slide-in transitions where an element enters from the left of its final position by 8px.',
							},
						},
						half: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for slide-in transitions where an element enters from the left of its final position by 50%.',
							},
						},
					},
					right: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for short slide-in transitions where an element enters from the right of its final position by 8px.',
							},
						},
					},
				},
				out: {
					top: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for short slide-out transitions where an element exits upward by 8px from its starting position.',
							},
						},
					},
					bottom: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for short slide-out transitions where an element exits downward by 8px from its starting position.',
							},
						},
					},
					left: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for short slide-out transitions where an element exits to the left by 8px from its starting position.',
							},
						},
						half: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for slide-out transitions where an element exits to the left of its starting position by 15%.',
							},
						},
					},
					right: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'active',
								introduced: '11.5.0',
								description:
									'Use for short slide-out transitions where an element exits to the right by 8px from its starting position.',
							},
						},
					},
				},
			},
		},
	},
};

export default font;
