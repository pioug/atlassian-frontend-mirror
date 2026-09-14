import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import SkeletonItems, { SkeletonItemLoaded } from '../../../examples/06-skeleton-items.vr.ap';

const variants: SnapshotTestOptions<Hooks>['variants'] = [
	{
		name: 'Light',
		environment: {
			colorScheme: 'light',
		},
	},
];

snapshot(SkeletonItems, { variants });

snapshot(SkeletonItemLoaded, { variants });
