import { snapshot } from '@af/visual-regression';

import { ErrorBoundary } from '../../examples';

snapshot(ErrorBoundary, {
	featureFlags: {
		'platform.linking-platform.link-picker.remove-dst-empty-state': [true, false],
	},
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
