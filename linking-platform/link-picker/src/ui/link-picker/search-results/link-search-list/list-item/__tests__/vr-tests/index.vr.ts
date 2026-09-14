import { snapshot } from '@af/visual-regression';

import { DefaultExample, SelectedExample } from '../../examples.vr.ap';

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
	featureFlags: {},
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
	featureFlags: {},
});
