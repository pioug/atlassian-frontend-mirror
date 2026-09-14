import { snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic.vr.ap';
import Testing from '../../../examples/99-testing.vr.ap';

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
	],
});
snapshot(Basic, {
	description: 'Focused date should show focus ring',
	states: [{ state: 'focused', selector: { byTestId: 'calendar--selected-day' } }],
	drawsOutsideBounds: true,
});
