import { type Hooks, snapshot, type SnapshotTestOptions } from '@af/visual-regression';

import {
	ButtonMenuItemExample,
	ExpandableMenuItemExample,
	FlyoutMenuItemExample,
	LinkMenuItemExample,
} from '../../../../../examples/menu-item-conditional-tooltip';

const lightModeVariant: SnapshotTestOptions<Hooks>['variants'] = [
	{
		environment: { colorScheme: 'light' },
		name: 'default',
	},
];

// This file has to manually iterate over all cases as our VR testing setup
// uses this file as a "definition" that is statically extracted.

/**
 * **ButtonMenuItem**
 */

snapshot(ButtonMenuItemExample, {
	description: 'button-menu-item-[content:short]-[description:short]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item-[content:short]-[description:short]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ButtonMenuItemExample, {
	description: 'button-menu-item-[content:short]-[description:long]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item-[content:short]-[description:long]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ButtonMenuItemExample, {
	description: 'button-menu-item-[content:long]-[description:short]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item-[content:long]-[description:short]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ButtonMenuItemExample, {
	description: 'button-menu-item-[content:long]-[description:long]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item-[content:long]-[description:long]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ButtonMenuItemExample, {
	description: 'button-menu-item-[content:short]-[description:none]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item-[content:short]-[description:none]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ButtonMenuItemExample, {
	description: 'button-menu-item-[content:long]-[description:none]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item-[content:long]-[description:none]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ButtonMenuItemExample, {
	description: 'button-menu-item-with-tooltip-disabled',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item-with-tooltip-disabled' },
		},
	],
	drawsOutsideBounds: true,
});

/**
 * **Actions**
 *
 * Should not have any tooltip when over actions for menu items.
 * Note: not testing `actionsOnHover` as we cannot first trigger
 * a mouse hover and then another hover. We could do a focus in
 * the example to show the actions, but then we are testing the same flow
 * as `actions` anyway.
 */

snapshot(ButtonMenuItemExample, {
	description: 'button-menu-item-add-action-button',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'button-menu-item-add-action-button' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ButtonMenuItemExample, {
	description: 'menu-item-button-with-nested-children',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'menu-item-button-with-nested-children' },
		},
	],
	drawsOutsideBounds: true,
});

/**
 * **LinkMenuItem**
 */

snapshot(LinkMenuItemExample, {
	description: 'link-menu-item-[content:short]-[description:short]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link-menu-item-[content:short]-[description:short]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(LinkMenuItemExample, {
	description: 'link-menu-item-[content:short]-[description:long]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link-menu-item-[content:short]-[description:long]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(LinkMenuItemExample, {
	description: 'link-menu-item-[content:long]-[description:short]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link-menu-item-[content:long]-[description:short]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(LinkMenuItemExample, {
	description: 'link-menu-item-[content:long]-[description:long]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link-menu-item-[content:long]-[description:long]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(LinkMenuItemExample, {
	description: 'link-menu-item-[content:short]-[description:none]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link-menu-item-[content:short]-[description:none]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(LinkMenuItemExample, {
	description: 'link-menu-item-[content:long]-[description:none]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link-menu-item-[content:long]-[description:none]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(LinkMenuItemExample, {
	description: 'link-menu-item-with-tooltip-disabled',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'link-menu-item-with-tooltip-disabled' },
		},
	],
	drawsOutsideBounds: true,
});

/**
 * **ExpandableMenuItem**
 *
 * No descriptions for expandable menu items
 */

snapshot(ExpandableMenuItemExample, {
	description: 'expandable-menu-item-[content:short]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'expandable-menu-item-[content:short]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ExpandableMenuItemExample, {
	description: 'expandable-menu-item-[content:long]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'expandable-menu-item-[content:long]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(ExpandableMenuItemExample, {
	description: 'expandable-menu-item-with-tooltip-disabled',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'expandable-menu-item-with-tooltip-disabled' },
		},
	],
	drawsOutsideBounds: true,
});

/**
 * **FlyoutMenuItem**
 *
 * No descriptions for flyout menu items
 */

snapshot(FlyoutMenuItemExample, {
	description: 'flyout-menu-item-[content:short]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'flyout-menu-item-[content:short]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemExample, {
	description: 'flyout-menu-item-[content:long]',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'flyout-menu-item-[content:long]' },
		},
	],
	drawsOutsideBounds: true,
});

snapshot(FlyoutMenuItemExample, {
	description: 'flyout-menu-item-with-tooltip-disabled',
	variants: lightModeVariant,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'flyout-menu-item-with-tooltip-disabled' },
		},
	],
	drawsOutsideBounds: true,
});
