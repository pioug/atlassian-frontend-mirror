import { snapshot } from '@af/visual-regression';

import {
	DefaultExample,
	DefaultOpenExample,
	SourceOnlyExample,
	SourceOnlyOpenExample,
} from '../../../examples/example';

snapshot(DefaultExample, {
	description: 'showcase-and-source - default',
});

snapshot(DefaultOpenExample, {
	description: 'showcase-and-source - open',
});

snapshot(SourceOnlyExample, {
	description: 'source-only - default',
});

snapshot(SourceOnlyOpenExample, {
	description: 'source-only - open',
});

snapshot(DefaultExample, {
	description: 'focused',
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'button',
			},
		},
	],
});

snapshot(DefaultExample, {
	description: 'hovered',
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
			},
		},
	],
});
