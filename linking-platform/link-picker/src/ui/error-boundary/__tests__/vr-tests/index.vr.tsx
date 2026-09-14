import { snapshot } from '@af/visual-regression';

import { ErrorBoundary } from '../../examples.vr.ap';

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
});
