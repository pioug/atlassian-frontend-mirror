import { snapshot } from '@af/visual-regression';

import Example from '../../../examples/12-nested-side-navigation-scroll-indicator';

snapshot(Example, {
	variants: [
		{
			name: 'default',
			environment: {},
		},
	],
});
