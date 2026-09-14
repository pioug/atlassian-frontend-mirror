import { snapshot } from '@af/visual-regression';

import ClosestEdge from '../../examples/00-closest-edge.vr.ap';
import Gap from '../../examples/01-gap.vr.ap';

snapshot(ClosestEdge, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
snapshot(Gap, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
