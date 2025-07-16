import { snapshot } from '@af/visual-regression';

import LinkItem from '../../../examples/link-item';

snapshot(LinkItem, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'first-item',
			},
		},
		{
			state: 'focused',
			selector: {
				byTestId: 'first-item',
			},
		},
	],
});
