import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import { TopLevelSpacerExample } from '../../../../../examples/top-level-spacer';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(TopLevelSpacerExample, {
	variants: lightModeVariant,
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
});
