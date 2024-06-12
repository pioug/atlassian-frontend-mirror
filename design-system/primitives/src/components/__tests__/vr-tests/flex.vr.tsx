// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/61-flex';

snapshot(Example, {
	variants: [
		{
			name: 'flex default',
			environment: {},
		},
	],
});
