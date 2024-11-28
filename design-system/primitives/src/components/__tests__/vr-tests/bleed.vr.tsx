import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/63-bleed';

snapshot(Example, {
	variants: [
		{
			name: 'bleed default',
			environment: {},
		},
	],
});
