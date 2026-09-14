import { snapshot } from '@af/visual-regression';

import LooseExample from '../../examples/loose.vr.ap';
import StrictExample from '../../examples/strict.vr.ap';

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
