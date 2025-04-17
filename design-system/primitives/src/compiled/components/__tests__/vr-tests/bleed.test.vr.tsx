import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/63-bleed-compiled';

snapshot(Example, {
	variants: [
		{
			name: 'bleed default',
			environment: {},
		},
	],
});
