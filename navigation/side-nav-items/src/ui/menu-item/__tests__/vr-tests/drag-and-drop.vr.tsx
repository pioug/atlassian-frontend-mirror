import { Device, type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	AllMenuItems,
	ButtonMenuItemCombine,
	ButtonMenuItemReorderAfter,
	ButtonMenuItemReorderBefore,
	ExpandableMenuItemCombine,
	ExpandableMenuItemReorderAfter,
	ExpandableMenuItemReorderBefore,
	FlyoutMenuItemCombine,
	FlyoutMenuItemReorderAfter,
	FlyoutMenuItemReorderBefore,
	LinkMenuItemCombine,
	LinkMenuItemCombineBlocked,
	LinkMenuItemReorderAfter,
	LinkMenuItemReorderAFterBlocked,
	LinkMenuItemReorderBefore,
	LinkMenuItemReorderBeforeBlocked,
} from '../../../../../examples/drag-and-drop/simple';

// Adding for all variants as we have had some
// Note: using a function as the Gemeni generated test file
// pulls some cases before this line, so we need a function
function workaround(): SnapshotTestOptions<Hooks>['variants'] {
	return [
		{
			environment: { colorScheme: 'light' },
			name: 'desktop-chrome',
			device: Device.DESKTOP_CHROME,
		},
		{
			environment: { colorScheme: 'light' },
			name: 'desktop-webkit',
			device: Device.DESKTOP_WEBKIT,
		},
		/**
		 * 🙅🦊 **Not running our VR tests on firefox** (5th May 2025)
		 *
		 * There are some visual bugs with subgrid in `Firefox@125`,
		 * which is the version our VR test runner users.
		 *
		 * - This bug was fixed in `Firefox@126`.
		 * - Latest version is `Firefox@137` (5th May 2025)
		 *
		 * We can re enable this test once our VRs run against a later version of Firefox.
		 */
		// {
		// 	environment: { colorScheme: 'light' },
		// 	name: 'desktop-firefox',
		// 	device: Device.DESKTOP_FIREFOX,
		// },
	];
}

snapshot(AllMenuItems, {
	description: 'link-menu-item',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link-menu-item' },
		},
	],
});

snapshot(AllMenuItems, {
	description: 'button-menu-item',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item' },
		},
	],
});

snapshot(AllMenuItems, {
	description: 'flyout-menu-item-trigger',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'flyout-menu-item-trigger' },
		},
	],
});

snapshot(AllMenuItems, {
	description: 'expandable-menu-item-trigger',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'expandable-menu-item-trigger' },
		},
	],
});

// LinkMenuItem
snapshot(LinkMenuItemReorderBefore, {
	description: 'link-menu-item-reorder-before',
	variants: workaround(),
});
snapshot(LinkMenuItemReorderAfter, {
	description: 'link-menu-item-reorder-after',
	variants: workaround(),
});
snapshot(LinkMenuItemCombine, {
	description: 'link-menu-item-combine',
	variants: workaround(),
});

// ButtonMenuItem
snapshot(ButtonMenuItemReorderBefore, {
	description: 'button-menu-item-reorder-before',
	variants: workaround(),
});
snapshot(ButtonMenuItemReorderAfter, {
	description: 'button-menu-item-reorder-after',
	variants: workaround(),
});
snapshot(ButtonMenuItemCombine, {
	description: 'button-menu-item-combine',
	variants: workaround(),
});

// FlyoutMenuItem
snapshot(FlyoutMenuItemReorderBefore, {
	description: 'flyout-menu-item-reorder-before',
	variants: workaround(),
});
snapshot(FlyoutMenuItemReorderAfter, {
	description: 'flyout-menu-item-reorder-after',
	variants: workaround(),
});
snapshot(FlyoutMenuItemCombine, {
	description: 'flyout-menu-item-combine',
	variants: workaround(),
});

// ExpandableMenuItem
snapshot(ExpandableMenuItemReorderBefore, {
	description: 'expandable-menu-item-reorder-before',
	variants: workaround(),
});
snapshot(ExpandableMenuItemReorderAfter, {
	description: 'expandable-menu-item-reorder-after',
	variants: workaround(),
});
snapshot(ExpandableMenuItemCombine, {
	description: 'expandable-menu-item-combine',
	variants: workaround(),
});

// Blocked instructions.
// Only testing blocking instructions on one menu item type
// as it would not add much value to test all menu item types.

snapshot(LinkMenuItemReorderBeforeBlocked, {
	description: 'link-menu-item-reorder-before-blocked',
	variants: workaround(),
});
snapshot(LinkMenuItemReorderAFterBlocked, {
	description: 'link-menu-item-reorder-after-blocked',
	variants: workaround(),
});

snapshot(LinkMenuItemCombineBlocked, {
	description: 'link-menu-item-combine-blocked',
	variants: workaround(),
});
