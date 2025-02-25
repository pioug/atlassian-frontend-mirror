// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import Basic from '../../../../../examples/70-text-compiled';
import Color from '../../../../../examples/71-text-color-compiled';
import Truncation from '../../../../../examples/72-text-truncation-compiled';

snapshot(Basic, {
	variants: [
		{
			name: 'text default',
			environment: {},
		},
	],
});
snapshot(Color, {
	featureFlags: {
		'platform-typography-improved-color-control': [true, false],
	},
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
