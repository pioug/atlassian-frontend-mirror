import { snapshot } from '@af/visual-regression';

import { ShouldFitContainerExampleWithInitialOpen as ShouldFitContainer } from '../../../examples/18-should-fit-container';

snapshot(ShouldFitContainer, {
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
