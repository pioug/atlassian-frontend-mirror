import { snapshot } from '@af/visual-regression';

import App from '../../../examples/drag-and-drop-jira-scaling-vr';

snapshot(App, {
	variants: [
		{
			environment: { colorScheme: 'light' },
			name: 'desktop',
		},
	],
});
