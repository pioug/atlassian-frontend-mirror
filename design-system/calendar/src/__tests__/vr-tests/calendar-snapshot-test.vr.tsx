import { snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic';
import Testing from '../../../examples/99-testing';

snapshot(Basic);
snapshot(Testing, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
snapshot(Basic, {
	description: 'Focused date should show focus ring',
	states: [{ state: 'focused', selector: { byTestId: 'calendar--selected-day' } }],
	drawsOutsideBounds: true,
});
