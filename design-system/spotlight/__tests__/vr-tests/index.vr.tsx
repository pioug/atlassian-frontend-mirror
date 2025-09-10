import { snapshot } from '@af/visual-regression';

import Basic from '../../examples/basic';
import MultiStep from '../../examples/multi-step';
import NoMedia from '../../examples/without-image';

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

snapshot(NoMedia, {
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
