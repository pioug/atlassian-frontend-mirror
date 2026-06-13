import type { AttributeSchema, RovoSurfaceTokenSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const surface: AttributeSchema<RovoSurfaceTokenSchema<BaseToken>> = {
	elevation: {
		rovo: {
			surface: {
				overlay: {
					'[default]': {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '13.3.0',
							description: 'Use for Rovo overlay surface backgrounds.',
						},
					},
					hovered: {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '13.3.0',
							description: 'Hovered state of elevation.rovo.surface.overlay.',
						},
					},
					pressed: {
						attributes: {
							group: 'paint',
							state: 'active',
							introduced: '13.3.0',
							description: 'Pressed state of elevation.rovo.surface.overlay.',
						},
					},
				},
			},
		},
	},
};

export default surface;
