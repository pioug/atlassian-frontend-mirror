import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/62-grid-gap.vr.ap';

snapshot(Example, {
	variants: [
		{
			name: 'grid default',
			environment: {},
		},
	],
});
