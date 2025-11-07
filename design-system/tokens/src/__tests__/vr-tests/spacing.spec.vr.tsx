import { snapshot } from '@af/visual-regression';

import SpacingVr from '../../../examples/4-spacing-vr';

snapshot(SpacingVr, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(SpacingVr, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
	],
});
