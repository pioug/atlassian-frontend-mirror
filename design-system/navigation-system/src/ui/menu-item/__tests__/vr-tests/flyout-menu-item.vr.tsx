import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	FlyoutMenuItemDefaultOpenExample,
	FlyoutMenuItemDefaultOpenRTL,
	FlyoutMenuItemDefaultOpenSelectedVR,
	FlyoutMenuItemExample,
	FlyoutMenuItemRTL,
	FlyoutMenuItemWithNestedPopupDefaultOpenExample,
} from '../../../../../examples/flyout-menu-item';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(FlyoutMenuItemExample, {
	variants: lightModeVariant,
});

snapshot(FlyoutMenuItemDefaultOpenExample, {
	variants: lightModeVariant,
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemDefaultOpenSelectedVR, {
	variants: lightModeVariant,
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemRTL, {
	variants: lightModeVariant,
});

snapshot(FlyoutMenuItemDefaultOpenRTL, {
	variants: lightModeVariant,
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemWithNestedPopupDefaultOpenExample, {
	description: 'A flyout menu with a nested popup using `shouldRenderToParent`',
	variants: lightModeVariant,
	drawsOutsideBounds: true,
});
