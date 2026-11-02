import type { AttributeSchema, MotionIconographyTokenSchema } from '../../../src/types';
import type { MotionPaletteToken } from '../../palettes/motion-palette';

const iconography: AttributeSchema<MotionIconographyTokenSchema<MotionPaletteToken>> = {
	motion: {
		iconography: {
			enter: {
				fade: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '20.9.0',
						description:
							'Use for an icon fading in as it appears or replaces another icon. Pair with `motion.iconography.exit.fade`.',
					},
				},
				cycle: {
					up: {
						attributes: {
							group: 'motion',
							state: 'experimental',
							introduced: '20.9.0',
							description:
								'Use for an icon sliding up into place from below. Pair with `motion.iconography.exit.cycle.up`.',
						},
					},
				},
			},
			exit: {
				fade: {
					attributes: {
						group: 'motion',
						state: 'experimental',
						introduced: '20.9.0',
						description:
							'Use for an icon fading out as it disappears or is replaced by another icon. Pair with `motion.iconography.enter.fade`.',
					},
				},
				cycle: {
					up: {
						attributes: {
							group: 'motion',
							state: 'experimental',
							introduced: '20.9.0',
							description:
								'Use for an icon sliding up and out of its box. Pair with `motion.iconography.enter.cycle.up`.',
						},
					},
				},
			},
		},
	},
};
export default iconography;
