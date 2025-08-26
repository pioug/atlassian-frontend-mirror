/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LinkMenuItemProps
 *
 * @codegen <<SignedSource::4a1f543c49be8d37af271ad72f46c373>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/link-menu-item/__generated__/index.partial.tsx <<SignedSource::8943197e8ce5439de1d6f88dda81d55b>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { LinkMenuItem as PlatformLinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';

type PlatformLinkMenuItemProps = React.ComponentProps<typeof PlatformLinkMenuItem>;
type Element = string | number | boolean | React.ReactNode;

export type LinkMenuItemProps = Pick<
	PlatformLinkMenuItemProps,
	| 'children'
	| 'testId'
	| 'isContentTooltipDisabled'
	| 'isDragging'
	| 'hasDragIndicator'
	| 'description'
	| 'target'
	| 'isSelected'
	| 'href'
	| 'elemBefore'
	| 'elemAfter'
	| 'actions'
	| 'actionsOnHover'
	| 'dropIndicator'
> & {
	/**
	 * Called when the user has clicked on the trigger content.
	 */
	onClick?: () => void;
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
	elemBefore?: Element;
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
	elemAfter?: Element;
	/**
	 * `ReactNode` to be placed visually after the `children`.
	 *
	 * It is intended for additional actions (e.g. IconButtons).
	 *
	 * They will not be rendered when the menu item is disabled.
	 */
	actions?: Element;
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
	actionsOnHover?: Element;
	/**
	 * A slot to render drop indicators for drag and drop operations on the menu item.
	 */
	dropIndicator?: Element;
};

/**
 * A menu item that is wrapped in an anchor tag <a>. This is the most common type of menu item, as most menu items are used to send people to another location.
 *
 * @see [LinkMenuItem](https://developer.atlassian.com/platform/forge/ui-kit/components/link-menu-item/) in UI Kit documentation for more information
 */
export type TLinkMenuItem<T> = (props: LinkMenuItemProps) => T;
