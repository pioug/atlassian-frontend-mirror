import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import { Divider } from '../../divider';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(Divider, {
	variants: lightModeVariant,
});
