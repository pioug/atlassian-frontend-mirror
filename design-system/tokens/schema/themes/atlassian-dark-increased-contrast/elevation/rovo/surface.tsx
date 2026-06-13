import type { RovoSurfaceTokenSchema, ValueSchema } from '../../../../../src/types';
import type { BaseToken } from '../../../../palettes/palette';

const surface: ValueSchema<RovoSurfaceTokenSchema<BaseToken>> = {
	elevation: {
		rovo: {
			surface: {
				overlay: {
					'[default]': { value: 'DarkNeutral200' },
					hovered: { value: 'DarkNeutral250' },
					pressed: { value: 'DarkNeutral300' },
				},
			},
		},
	},
};

export default surface;
