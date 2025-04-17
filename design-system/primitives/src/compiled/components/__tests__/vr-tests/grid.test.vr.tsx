import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/62-grid-gap-compiled';

snapshot(Example, {
	variants: [
		{
			name: 'grid default',
			environment: {},
		},
	],
});
