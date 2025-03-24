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
		'bandicoots-a11y-link-picker-styling': true,
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
		'bandicoots-a11y-link-picker-styling': true,
	},
});
