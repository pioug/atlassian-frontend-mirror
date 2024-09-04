// eslint-disable-next-line import/no-extraneous-dependencies
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
	// Note: When the enviromnent is set the feature flags are always false regardless of this setting. That's why a separate test is introduced
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
