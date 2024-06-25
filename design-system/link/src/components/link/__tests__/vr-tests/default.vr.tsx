import { snapshot } from '@af/visual-regression';

import DefaultExample from '../../../../../examples/01-default';

import { themeVariants } from './utils';

snapshot(DefaultExample, {
	description: 'Resting',
	variants: themeVariants,
});

snapshot(DefaultExample, {
	description: 'Hovered',
	variants: themeVariants,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link' },
		},
	],
});

snapshot(DefaultExample, {
	description: 'Focused',
	variants: themeVariants,
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'link' },
		},
	],
});
