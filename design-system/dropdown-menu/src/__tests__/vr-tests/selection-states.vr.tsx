import { snapshot } from '@af/visual-regression';

import SelectionStates from '../../../examples/selection-states.vr.ap';

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
	],
});
