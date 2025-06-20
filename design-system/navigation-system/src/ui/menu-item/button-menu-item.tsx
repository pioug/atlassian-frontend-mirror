import React, { forwardRef } from 'react';

import { MenuItemBase } from './menu-item';
import { MenuListItem } from './menu-list-item';
import type { MenuItemLinkOrButtonCommonProps, MenuItemOnClick } from './types';

/**
 * We intentionally do not support the `isSelected` prop (which other menu item components
 * support) because `ButtonMenuItem`s do not correspond to a "page", so can't be navigated
 *  to and become in a selected state.
 */
export type ButtonMenuItemProps = MenuItemLinkOrButtonCommonProps & {
	/**
	 * We are not using a discriminated union to enforce that the `actions` and `actionsOnHover`
	 * props are not used when `isDisabled` is true due to ergonomic type issues with `boolean`
	 * types (as oppposed to literal `true` or `false` types), e.g. if a conditional boolean
	 * variable is passed to `isDisabled`.
	 */
	/**
	 * Whether the menu item is disabled.
	 *
	 * When disabled, content in the `actions` and `actionsOnHover` props will not be rendered.
	 *
	 * The menu item will not be interactive and will not respond to hover or focus.
	 */
	isDisabled?: boolean;

	/**
	 * Called when the user has clicked on the trigger content.
	 */
	onClick?: MenuItemOnClick<HTMLButtonElement>;
};

/**
 * __ButtonMenuItem__
 *
 * A menu item button. It should be used within a `ul`, as it renders a list item.
 */
export const ButtonMenuItem = forwardRef<HTMLButtonElement, ButtonMenuItemProps>(
	(
		{
			testId,
			actions,
			children,
			description,
			elemAfter,
			isDisabled,
			elemBefore,
			actionsOnHover,
			onClick,
			interactionName,
			isContentTooltipDisabled,
			visualContentRef,
			listItemRef,
			isDragging,
			hasDragIndicator,
			dropIndicator,
		},
		forwardedRef,
	) => (
		<MenuListItem ref={listItemRef}>
			<MenuItemBase
				testId={testId}
				description={description}
				elemAfter={elemAfter}
				elemBefore={elemBefore}
				isDisabled={isDisabled}
				/**
				 * Not passing `actions` and `actionsOnHover` to MenuItemBase when `isDisabled`,
				 * so they aren't rendered in the disabled state.
				 */
				actions={isDisabled ? undefined : actions}
				actionsOnHover={isDisabled ? undefined : actionsOnHover}
				onClick={onClick}
				ref={forwardedRef}
				visualContentRef={visualContentRef}
				interactionName={interactionName}
				isContentTooltipDisabled={isContentTooltipDisabled}
				isDragging={isDragging}
				hasDragIndicator={hasDragIndicator}
				dropIndicator={dropIndicator}
			>
				{children}
			</MenuItemBase>
		</MenuListItem>
	),
);
