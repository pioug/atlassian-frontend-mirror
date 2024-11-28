import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/70-text';
import Color from '../../../../examples/71-text-color';
import Truncation from '../../../../examples/72-text-truncation';

snapshot(Basic, {
	featureFlags: {
		'platform-primitives-nested-text-inherit-size': [true, false],
	},
	variants: [
		{
			name: 'text default',
			environment: {},
		},
	],
});
snapshot(Color, {
	variants: [
		{
			name: 'text color',
			environment: {},
		},
	],
});
snapshot(Truncation, {
	variants: [
		{
			name: 'text truncation',
			environment: {},
		},
	],
});
