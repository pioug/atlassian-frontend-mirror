// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import SpacingVr from '../../../examples/4-spacing-vr';
import ShapeVr from '../../../examples/8-shape-vr';

snapshot(SpacingVr, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
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
	// Note: When the enviromnent is set the feature flags are always false regardless of this setting. That's why a separate test is introduced
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
snapshot(ShapeVr);
