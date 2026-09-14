import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/63-bleed-compiled.vr.ap';

snapshot(Example, {
	variants: [
		{
			name: 'bleed default',
			environment: {},
		},
	],
});
