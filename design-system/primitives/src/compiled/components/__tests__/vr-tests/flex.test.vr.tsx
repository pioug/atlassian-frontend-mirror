import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/61-flex-compiled';

snapshot(Example, {
	variants: [
		{
			name: 'flex default',
			environment: {},
		},
	],
});
