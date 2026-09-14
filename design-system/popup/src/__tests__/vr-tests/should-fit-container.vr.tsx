import { snapshot } from '@af/visual-regression';

import { ShouldFitContainerExampleWithInitialOpen as ShouldFitContainer } from '../../../examples/18-should-fit-container.vr.ap';

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(ShouldFitContainer, {
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
