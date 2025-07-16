import { snapshot } from '@af/visual-regression';

import SelectionStates from '../../../examples/selection-states';

snapshot(SelectionStates, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
