import { snapshot } from '@af/visual-regression';

import { DefaultExample, SelectedExample } from '../../examples';

snapshot(DefaultExample, {
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
snapshot(SelectedExample, {
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
