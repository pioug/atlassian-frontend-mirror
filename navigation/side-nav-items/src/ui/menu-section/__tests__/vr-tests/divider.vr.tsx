import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import { Divider } from '../../divider';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(Divider, {
	variants: lightModeVariant,
});
