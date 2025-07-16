import { snapshot } from '@af/visual-regression';

import CustomItem from '../../../examples/custom-item';

snapshot(CustomItem, {
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
