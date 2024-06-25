import { snapshot } from '@af/visual-regression';

import SubtleExample from '../../../../../examples/02-subtle';

import { themeVariants } from './utils';

snapshot(SubtleExample, {
	description: 'Resting',
	variants: themeVariants,
});

snapshot(SubtleExample, {
	description: 'Hovered',
	variants: themeVariants,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link' },
		},
	],
});

snapshot(SubtleExample, {
	description: 'Focused',
	variants: themeVariants,
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'link' },
		},
	],
});
