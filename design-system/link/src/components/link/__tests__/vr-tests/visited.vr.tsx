import { snapshot } from '@af/visual-regression';

import VisitedExample from '../../../../../examples/04-visited';

import { themeVariants } from './utils';

snapshot(VisitedExample, {
	description: 'Resting',
	variants: themeVariants,
});

snapshot(VisitedExample, {
	description: 'Hovered',
	variants: themeVariants,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'Default' },
		},
	],
});

snapshot(VisitedExample, {
	description: 'Focused',
	variants: themeVariants,
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'Default' },
		},
	],
});
