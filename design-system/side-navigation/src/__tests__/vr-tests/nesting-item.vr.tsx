import { snapshot } from '@af/visual-regression';

import Example from '../../../examples/nesting-item';

snapshot(Example, {
	variants: [
		{
			name: 'nesting-item',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'selected--item' },
		},
	],
});
