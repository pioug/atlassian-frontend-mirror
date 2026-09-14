import { snapshot } from '@af/visual-regression';

import Basic from '../../../../../examples/70-text-compiled.vr.ap';
import Color from '../../../../../examples/71-text-color-compiled.vr.ap';
import Truncation from '../../../../../examples/72-text-truncation-compiled.vr.ap';

snapshot(Basic, {
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
