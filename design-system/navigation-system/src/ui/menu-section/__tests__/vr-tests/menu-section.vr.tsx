import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import MenuSectionExample from '../../../../../examples/menu-section';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(MenuSectionExample, {
	variants: lightModeVariant,
});
