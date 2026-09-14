import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/61-flex.vr.ap';

snapshot(Example, {
	variants: [
		{
			name: 'flex default',
			environment: {},
		},
	],
});
