import { snapshot } from '@af/visual-regression';

import TargetBlankExample from '../../../../../examples/03-target-blank';

import { themeVariants } from './utils';

snapshot(TargetBlankExample, {
	description: 'Resting',
	variants: themeVariants,
});

snapshot(TargetBlankExample, {
	description: 'Hovered',
	variants: themeVariants,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link' },
		},
	],
});

snapshot(TargetBlankExample, {
	description: 'Focused',
	variants: themeVariants,
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'link' },
		},
	],
});
