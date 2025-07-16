import { snapshot } from '@af/visual-regression';

import ButtonItem from '../../../examples/button-item';

snapshot(ButtonItem, {
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
