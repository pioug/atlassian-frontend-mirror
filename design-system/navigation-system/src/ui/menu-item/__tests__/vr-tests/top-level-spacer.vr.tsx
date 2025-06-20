import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import { GlobalAppsExample } from '../../../../../examples/constellation/side-navigation/global-apps';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(GlobalAppsExample, {
	variants: lightModeVariant,
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
});
