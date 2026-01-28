import { snapshot } from '@af/visual-regression';

import ValueChangeBugfixExample from '../../../../examples/160-value-switching-bugfix';

snapshot(ValueChangeBugfixExample, {
	variants: [
		{
			environment: { colorScheme: 'light' },
			name: 'light',
		},
	],
});
