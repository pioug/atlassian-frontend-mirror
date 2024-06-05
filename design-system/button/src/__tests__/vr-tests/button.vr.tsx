import { snapshot } from '@af/visual-regression';

import ButtonExample from '../../../examples/05-button';

import { themeVariants } from './utils';

snapshot(ButtonExample, {
	description: 'Resting',
	variants: themeVariants,
});

snapshot(ButtonExample, {
	description: 'Hovered',
	variants: themeVariants,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'the-button' },
		},
	],
});

snapshot(ButtonExample, {
	description: 'Focused',
	variants: themeVariants,
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'the-button' },
		},
	],
});
