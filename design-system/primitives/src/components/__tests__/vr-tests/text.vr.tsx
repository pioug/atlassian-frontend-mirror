import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/70-text';
import Color from '../../../../examples/71-text-color';
import Truncation from '../../../../examples/72-text-truncation';

snapshot(Basic, {
	variants: [
		{
			name: 'text default',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(Color, {
	variants: [
		{
			name: 'text color',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(Truncation, {
	variants: [
		{
			name: 'text truncation',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
