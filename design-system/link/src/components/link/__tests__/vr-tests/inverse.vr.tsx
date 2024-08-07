import { snapshot } from '@af/visual-regression';

import InverseExample from '../../../../../examples/07-inverse';

import { themeVariants } from './utils';

snapshot(InverseExample, {
	description: 'Resting',
	variants: themeVariants,
});

snapshot(InverseExample, {
	description: 'Hovered',
	variants: themeVariants,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link' },
		},
	],
});

snapshot(InverseExample, {
	description: 'Focused',
	variants: themeVariants,
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'link' },
		},
	],
});
