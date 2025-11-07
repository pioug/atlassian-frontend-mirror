import { snapshot } from '@af/visual-regression';

import CurrentSurfaceVr from '../../../examples/10-current-surface-vr';

snapshot(CurrentSurfaceVr, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(CurrentSurfaceVr, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
	],
});
