import type React from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { type COLLAPSE_ELEM_BEFORE_TYPE } from './menu-item-signals';

export type MenuItemOnClick<T extends HTMLAnchorElement | HTMLButtonElement> = (
	event: React.MouseEvent<T>,
	analyticsEvent: UIAnalyticsEvent,
) => void;

/**
 * Props shared across _all_ menu item components:
 * - MenuItemBase
 * - LinkMenuItem
 * - ButtonMenuItem
 * - ExpandableMenuItemTrigger
 * - FlyoutMenuItemTrigger
 */
export type MenuItemCommonProps = {
	/**
	 * The main textual content and label of the menu item.
	 *
	 * The content will be truncated to fit into the side nav in one line.
	 *
	 * **Note:** Placing non-textual content (such as lozenges) can cause unexpected truncation behavior.
	 * Use the provided slot props such as `elemBefore` or `elemAfter` for non-textual content instead.
	 */
	children: React.ReactNode;

	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;

	/**
	 * Disable tooltip for menu item content. This should only be done when there is some other way
	 * to display the full menu content and description of a menu item close by (eg with another popup)
	 */
	isContentTooltipDisabled?: boolean;

	/**
	 * Exposes the visually complete menu item, including:
	 *
	 * - the main interactive element (exposed through `ref`)
	 * - any `elemBefore`, `elemAfter`, `actions`, or `actionsOnHover`
	 *
	 * This specifically excludes the wrapping list item,
	 * which is also exposed through either:
	 * - the `listItemRef` prop for LinkMenuItem and ButtonMenuItem
	 * - the `ref` prop for FlyoutMenuItem and ExpandableMenuItem
	 */
	visualContentRef?: React.Ref<HTMLDivElement>;

	/**
	 * Whether the element is being dragged. Will apply "dragging" styles to
	 * menu item.
	 */
	isDragging?: boolean;

	/**
	 * Whether this menu item can be dragged. Add a drag handle to this item.
	 * You are responsible for wiring up drag and drop to the menu item.
	 *
	 *
	 * - Please be sure to make the MenuItem `ref` the `draggable` element
	 * - See our navigation drag and drop guidelines for more technical details
	 */
	hasDragIndicator?: boolean;

	/**
	 * A slot to render drop indicators for drag and drop operations on the menu item.
	 */
	dropIndicator?: React.ReactNode;
};

/**
 * Menu item grid slots. These are used in:
 * - MenuItemBase
 * - LinkMenuItem
 * - ButtonMenuItem
 * - ExpandableMenuItemTrigger
 */
export type MenuItemSlots = {
	/**
	 * `ReactNode` to be placed visually before the `children`.
	 *
	 * This `ReactNode` will be rendered visually on top of the main
	 * interactive element for the menu item. If this element does not
	 * contain an interactive element (`button` or `a`) then `pointer-events`
	 * will be set to `none` on this slot so that users can click through
	 * this element onto the main interactive element of the menu item.
	 *
	 * If you want to collapse the `elemBefore` so it takes up no space,
	 * then pass in the `COLLAPSE_ELEM_BEFORE` symbol. Keep in mind that
	 * collapsing the `elemBefore` can break visual alignment and
	 * will make it difficult for users to visually distinguish levels
	 * in the side navigation.
	 *
	 * @example
	 *
	 * ```tsx
	 * <MenuItemButton elemBefore={<HomeIcon label="home" />}>Home</MenuItemButton>
	 *
	 * // collapse the elemBefore
	 * <MenuItemButton elemBefore={COLLAPSE_ELEM_BEFORE}>Home</MenuItemButton>
	 * ```
	 */
	elemBefore?: React.ReactNode | COLLAPSE_ELEM_BEFORE_TYPE;

	/**
	 * `ReactNode` to be placed visually after the `children`.
	 *
	 * It is intended for additional actions (e.g. IconButtons).
	 *
	 * They will not be rendered when the menu item is disabled.
	 */
	actions?: React.ReactNode;

	/**
	 * `ReactNode` to be placed visually after the `children`.
	 *
	 * It is intended for static content (e.g. a `Lozenge`).
	 *
	 * If both `elemAfter` and `actionsOnHover` are provided, `elemAfter` will
	 * not be displayed when the item is hovered over or expanded. This is
	 * because the `actionsOnHover` will be displayed instead.
	 *
	 * This `ReactNode` will be rendered visually on top of the main
	 * interactive element for the menu item. If this element does not
	 * contain an interactive element (`button` or `a`) then `pointer-events`
	 * will be set to `none` on this slot so that users can click through
	 * this element onto the main interactive element of the menu item.
	 */
	elemAfter?: React.ReactNode;

	/**
	 * `ReactNode` to be placed visually after the `children` and will
	 * only be displayed on hover or focus.
	 *
	 * It is intended for additional actions (e.g. IconButtons).
	 *
	 * This `ReactNode` will replace `elemAfter` on hover or focus.
	 *
	 * They will not be rendered when the menu item is disabled.
	 *
	 * This `ReactNode` will be rendered visually on top of the main
	 * interactive element for the menu item. If this element does not
	 * contain an interactive element (`button` or `a`) then `pointer-events`
	 * will be set to `none` on this slot so that users can click through
	 * this element onto the main interactive element of the menu item.
	 */
	actionsOnHover?: React.ReactNode;
};

/**
 * Props shared across:
 * - MenuItemBase
 * - LinkMenuItem
 * - ButtonMenuItem
 */
export type MenuItemLinkOrButtonCommonProps = MenuItemCommonProps &
	MenuItemSlots & {
		/**
		 * Additional textual content for the menu item.
		 * It is displayed underneath the main content.
		 */
		description?: string;

		/**
		 * Exposes the `<div role="listitem">` element that wraps the entire item.
		 *
		 * This is the root element rendered by the component.
		 */
		listItemRef?: React.Ref<HTMLDivElement>;
	};
