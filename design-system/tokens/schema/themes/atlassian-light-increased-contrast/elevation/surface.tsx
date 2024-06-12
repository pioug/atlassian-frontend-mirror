import type { ExtendedValueSchema, SurfaceTokenSchema } from '../../../../src/types';
import type { BaseToken } from '../../../palettes/palette';

const elevation: ExtendedValueSchema<SurfaceTokenSchema<BaseToken>> = {
	elevation: {
		surface: {
			// TODO: Confirm - seems too light in Jira issue view. Difficult to identify columns
			sunken: {
				//@ts-expect-error TODO: Consider extending palette. Uses value outside range of palettes (would be Neutral50).
				value: '#FCFDFE',
			},
		},
	},
};

export default elevation;
