import { snapshot } from '@af/visual-regression';

import DisabledExample from '../../../../examples/04-disabled';

snapshot(DisabledExample, {
	variants: [
		{
			environment: { colorScheme: 'light' },
			name: 'light',
		},
	],
});
