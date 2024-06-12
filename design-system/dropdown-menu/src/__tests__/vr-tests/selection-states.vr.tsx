import { snapshot } from '@af/visual-regression';

import SelectionStates from '../../../examples/selection-states';

snapshot(SelectionStates, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
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
