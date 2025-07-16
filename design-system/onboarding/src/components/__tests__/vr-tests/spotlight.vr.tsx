import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import DifferentSpotlights from '../../../../examples/00-different-spotlights';
import SpotlightTargetHeight from '../../../../examples/104-spotlight-target-height';
import { SpotlightBasicChildrenFunctionDefaultOpenExample } from '../../../../examples/11-spotlight-basic-children-function';

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{
		name: 'light',
		environment: {
			colorScheme: 'light',
		},
	},
];

snapshot(SpotlightTargetHeight, {
	variants,
	drawsOutsideBounds: true,
});

snapshot(SpotlightBasicChildrenFunctionDefaultOpenExample, { variants, drawsOutsideBounds: true });

snapshot(DifferentSpotlights, {
	variants,
});
