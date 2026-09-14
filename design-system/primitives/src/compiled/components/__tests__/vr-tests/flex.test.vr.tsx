import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/61-flex-compiled.vr.ap';

snapshot(Example, {
	variants: [
		{
			name: 'flex default',
			environment: {},
		},
	],
});
