import type { AttributeSchema, MotionKeyframeTokenSchema } from '../../../src/types';
import type { BaseKeyframeToken } from '../../palettes/motion-palette';

const font: AttributeSchema<MotionKeyframeTokenSchema<BaseKeyframeToken>> = {
	motion: {
		keyframe: {
			scale: {
				in: {
					small: {
						attributes: {
							group: 'motionKeyframe',
							state: 'experimental',
							introduced: '11.5.0',
							description: '',
						},
					},
					medium: {
						attributes: {
							group: 'motionKeyframe',
							state: 'experimental',
							introduced: '11.5.0',
							description: '',
						},
					},
				},
				out: {
					small: {
						attributes: {
							group: 'motionKeyframe',
							state: 'experimental',
							introduced: '11.5.0',
							description: '',
						},
					},
					medium: {
						attributes: {
							group: 'motionKeyframe',
							state: 'experimental',
							introduced: '11.5.0',
							description: '',
						},
					},
				},
			},
			fade: {
				in: {
					attributes: {
						group: 'motionKeyframe',
						state: 'experimental',
						introduced: '11.5.0',
						description: '',
					},
				},
				out: {
					attributes: {
						group: 'motionKeyframe',
						state: 'experimental',
						introduced: '11.5.0',
						description: '',
					},
				},
			},
			slide: {
				in: {
					top: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
					},
					bottom: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
					},
					left: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
						half: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
					},
					right: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
					},
				},
				out: {
					top: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
					},
					bottom: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
					},
					left: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
						half: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
					},
					right: {
						short: {
							attributes: {
								group: 'motionKeyframe',
								state: 'experimental',
								introduced: '11.5.0',
								description: '',
							},
						},
					},	
				}
			}
		},
	},
};

export default font;
