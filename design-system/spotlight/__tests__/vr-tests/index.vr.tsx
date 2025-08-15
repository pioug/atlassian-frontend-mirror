import { snapshot } from '@af/visual-regression';

import Basic from '../../examples/basic';
import MultiStep from '../../examples/multi-step';

snapshot(Basic, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(MultiStep, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
