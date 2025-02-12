import { snapshot } from '@af/visual-regression';

import { ErrorBoundary } from '../../examples';

snapshot(ErrorBoundary, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform_bandicoots-link-picker-css': [true, false],
	},
});
