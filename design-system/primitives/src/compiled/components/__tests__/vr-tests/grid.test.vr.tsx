import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/62-grid-gap-compiled.vr.ap';

snapshot(Example, {
	variants: [
		{
			name: 'grid default',
			environment: {},
		},
	],
});
