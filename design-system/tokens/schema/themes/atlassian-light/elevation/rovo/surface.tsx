import type { RovoSurfaceTokenSchema, ValueSchema } from '../../../../../src/types';
import type { BaseToken } from '../../../../palettes/palette';

const surface: ValueSchema<RovoSurfaceTokenSchema<BaseToken>> = {
	elevation: {
		rovo: {
			surface: {
				overlay: {
					'[default]': { value: 'Neutral100' },
					hovered: { value: 'Neutral200' },
					pressed: { value: 'Neutral300' },
				},
			},
		},
	},
};

export default surface;
