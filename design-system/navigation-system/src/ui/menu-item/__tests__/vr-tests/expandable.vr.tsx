import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	ExpandableMenuItemCollapsedWithSelectedChild,
	ExpandableMenuItemExpandedWithActionsOnHover,
	ExpandableMenuItemExpandedWithActionsOnHoverAndElemAfter,
	ExpandableMenuItemExpandedWithElemAfter,
	ExpandableMenuItemNested,
	ExpandableMenuItemNestedRTL,
	ExpandableMenuItemSelected,
	ExpandableMenuItemSelectedWithActionsOnHover,
	ExpandableMenuItemSelectedWithDropdownActionOpen,
	ExpandableMenuItemSelectedWithIcon,
	ExpandableMenuItemWithActions,
	ExpandableMenuItemWithActionsOnHover,
	ExpandableMenuItemWithActionsOnHoverAndElemAfter,
	ExpandableMenuItemWithAllOptions,
	ExpandableMenuItemWithDropdownActionOpen,
} from '../../../../../examples/expandable-menu-item';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

snapshot(ExpandableMenuItemCollapsedWithSelectedChild, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemSelected, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemSelectedWithIcon, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemNested, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemNestedRTL, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemWithActions, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemExpandedWithElemAfter, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemWithActionsOnHover, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemExpandedWithActionsOnHover, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemWithActionsOnHoverAndElemAfter, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemExpandedWithActionsOnHoverAndElemAfter, {
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemWithActionsOnHover, {
	description: 'Expandable menu item with actions on hover - hovered',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'link',
				options: {
					name: 'Parent menu item',
				},
			},
		},
	],
});

snapshot(ExpandableMenuItemSelectedWithActionsOnHover, {
	description: 'Expandable menu item with actions on hover - selected and hovered',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'link',
				options: {
					name: 'Parent menu item',
				},
			},
		},
	],
});

snapshot(ExpandableMenuItemWithActionsOnHoverAndElemAfter, {
	description: 'Expandable menu item with actions on hover and elem after - hovered',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Parent menu item',
				},
			},
		},
	],
});

snapshot(ExpandableMenuItemWithDropdownActionOpen, {
	description: 'Expandable menu item - with dropdown action open',
	variants: lightModeVariant,
	drawsOutsideBounds: true,
});

snapshot(ExpandableMenuItemWithDropdownActionOpen, {
	description: 'Expandable menu item - with dropdown action open and hovered',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'link',
				options: {
					name: 'Parent menu item',
				},
			},
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ExpandableMenuItemSelectedWithDropdownActionOpen, {
	description: 'Expandable menu item - selected with dropdown action open',
	variants: lightModeVariant,
	drawsOutsideBounds: true,
});

snapshot(ExpandableMenuItemWithAllOptions, {
	description: 'Expandable menu item - custom elemBefore - default state',
	variants: lightModeVariant,
});

snapshot(ExpandableMenuItemWithAllOptions, {
	description: 'Expandable menu item - custom elemBefore - menu item hovered',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'link',
				options: {
					name: 'Parent menu item',
				},
			},
		},
	],
});

snapshot(ExpandableMenuItemWithAllOptions, {
	description: 'Expandable menu item - custom elemBefore - menu item focused',
	variants: lightModeVariant,
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'link',
				options: {
					name: 'Parent menu item',
				},
			},
		},
	],
});

snapshot(ExpandableMenuItemWithAllOptions, {
	description: 'Expandable menu item - custom elemBefore - elemBefore hovered',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'parent-menu-item--elem-before-button',
			},
		},
	],
	featureFlags: {
		platform_dst_expandable_menu_item_elembefore_label: true,
	},
});

snapshot(ExpandableMenuItemWithAllOptions, {
	description: 'Expandable menu item - custom elemBefore - elemBefore focused',
	variants: lightModeVariant,
	states: [
		{
			state: 'focused',
			selector: {
				byTestId: 'parent-menu-item--elem-before-button',
			},
		},
	],
	featureFlags: {
		platform_dst_expandable_menu_item_elembefore_label: true,
	},
});

snapshot(ExpandableMenuItemWithAllOptions, {
	description: 'Expandable menu item - custom elemBefore - action hovered',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: {
				byRole: 'button',
				options: {
					name: 'Add',
				},
			},
		},
	],
});

snapshot(ExpandableMenuItemWithAllOptions, {
	description: 'Expandable menu item - custom elemBefore - action focused',
	variants: lightModeVariant,
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'button',
				options: {
					name: 'Add',
				},
			},
		},
	],
});
