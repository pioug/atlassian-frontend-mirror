import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
    SkeletonFlyoutExample,
    SkeletonMenuItemsExample,
} from '../../../../../examples/skeleton';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(SkeletonMenuItemsExample, {
	variants: lightModeVariant,
});

snapshot(SkeletonFlyoutExample, {
	variants: lightModeVariant,
});
