import { snapshot } from '@af/visual-regression';

import LooseExample from '../../examples/loose';
import StrictExample from '../../examples/strict';

snapshot(LooseExample, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(StrictExample, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
