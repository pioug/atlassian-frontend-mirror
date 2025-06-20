import { Device, type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	ButtonMenuItemDisabled,
	ButtonMenuItemDisabledWithActions,
	ButtonMenuItemExample,
	ButtonMenuItemRTLExample,
	ButtonMenuItemWithDropdownActionOpen,
	ButtonMenuItemWithElemAfter,
	ButtonMenuItemWithElemAfterAndActionsOnHover,
	ButtonMenuItemWithPopup,
} from '../../../../../examples/button-menu-item';
import {
	LinkMenuItemExample,
	LinkMenuItemRTLExample,
	LinkMenuItemWithDropdownActionOpen,
	LinkMenuItemWithElemAfter,
	LinkMenuItemWithElemAfterAndActionsOnHover,
} from '../../../../../examples/link-menu-item';
import { MenuItemAvatarExample } from '../../../../../examples/menu-item-avatar';
import { LinkMenuItemBleed } from '../../../../../examples/menu-item-focus-ring-bleed';
import { MenuItemNarrowVR } from '../../../../../examples/menu-item-narrow';

// Adding all browser variants to ensure that the grid is working correctly
// for all browsers (as we have had some issues relating to browser specific issues).
// Using function due to ordering issues in the generated test file.
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
		{
			environment: { colorScheme: 'light' },
			name: 'desktop-firefox',
			device: Device.DESKTOP_FIREFOX,
		},
	];
}

snapshot(ButtonMenuItemExample, {
	variants: workaround(),
});
snapshot(LinkMenuItemExample, {
	variants: workaround(),
});
snapshot(ButtonMenuItemRTLExample, {
	variants: workaround(),
});
snapshot(LinkMenuItemRTLExample, {
	variants: workaround(),
});
snapshot(ButtonMenuItemWithPopup, {
	variants: workaround(),
	drawsOutsideBounds: true,
});
snapshot(MenuItemAvatarExample, {
	variants: workaround(),
});
snapshot(LinkMenuItemBleed, {
	variants: workaround(),
});

snapshot(ButtonMenuItemWithElemAfter, {
	// We expect the elemAfter to still be visible when hovered
	description: 'Button menu item with elem after and hovered',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'With elemAfter',
				},
			},
		},
	],
});
snapshot(LinkMenuItemWithElemAfter, {
	// We expect the elemAfter to still be visible when hovered
	description: 'Link menu item with elem after and hovered',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'link',
				options: {
					name: 'With elemAfter',
				},
			},
		},
	],
});

// Separate snapshots created for focused and hovered states, as Gemini only creates
// a snapshot for the first state variant in the array.
snapshot(ButtonMenuItemWithElemAfterAndActionsOnHover, {
	// We expect the elemAfter to not be visible, as it contains actionsOnHover
	description: 'Button menu item with actions on hover appearing on hover',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'With elemAfter and actionsOnHover',
				},
			},
		},
	],
});

snapshot(ButtonMenuItemWithElemAfterAndActionsOnHover, {
	// We expect the elemAfter to not be visible, as it contains actionsOnHover
	description: 'Button menu item with actions on hover appearing on focus',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'With elemAfter and actionsOnHover',
				},
			},
		},
	],
});

snapshot(LinkMenuItemWithElemAfterAndActionsOnHover, {
	// We expect the elemAfter to not be visible, as it contains actionsOnHover
	description: 'Link menu item with actions on hover appearing on hover',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'link',
				options: {
					name: 'With elemAfter and actionsOnHover',
				},
			},
		},
	],
});

snapshot(LinkMenuItemWithElemAfterAndActionsOnHover, {
	// We expect the elemAfter to not be visible, as it contains actionsOnHover
	description: 'Link menu item with actions on hover appearing on focus',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'link',
				options: {
					name: 'With elemAfter and actionsOnHover',
				},
			},
		},
	],
});

snapshot(ButtonMenuItemWithDropdownActionOpen, {
	description: 'Button menu item - with dropdown action open',
	variants: workaround(),
	drawsOutsideBounds: true,
});

snapshot(LinkMenuItemWithDropdownActionOpen, {
	description: 'Link menu item - with dropdown action open',
	variants: workaround(),
	drawsOutsideBounds: true,
});

snapshot(MenuItemNarrowVR, {
	description: 'Menu items in a narrow container',
	variants: workaround(),
});

snapshot(ButtonMenuItemDisabled, {
	description: 'Button menu item - disabled',
	variants: workaround(),
});

snapshot(ButtonMenuItemDisabled, {
	description: 'Button menu item - disabled - hovered',
	variants: workaround(),
	states: [
		{
			state: 'hovered',
			selector: { byRole: 'button', options: { name: 'Disabled' } },
		},
	],
});

// Asserting that `actions` and `actionsOnHover` are not rendered when the item is disabled
snapshot(ButtonMenuItemDisabledWithActions, {
	description: 'Button menu item - disabled with actions',
	variants: workaround(),
});
