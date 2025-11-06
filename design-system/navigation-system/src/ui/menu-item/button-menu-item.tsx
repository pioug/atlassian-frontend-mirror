import React, { forwardRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { MenuItemBase } from './menu-item';
import { MenuListItem } from './menu-list-item';
import type { MenuItemLinkOrButtonCommonProps, MenuItemOnClick } from './types';

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

	/**
	 * Identifies the popup element that this element controls when it is used as a popup trigger.
	 * Should match the `id` of the popup content for screen readers to understand the relationship.
	 */
	'aria-controls'?: string;

	/**
	 * Announces to assistive technology whether the popup is currently open or closed,
	 * when this element is used as a popup trigger.
	 */
	'aria-expanded'?: boolean;

	/**
	 * Informs assistive technology that this element triggers a popup.
	 */
	'aria-haspopup'?: boolean | 'dialog';
};

/**
 * __ButtonMenuItem__
 *
 * A menu item button. It should be used within a `ul`, as it renders a list item.
 */
export const ButtonMenuItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ButtonMenuItemProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ButtonMenuItemProps>(
	(
		{
			testId,
			actions,
			children,
			description,
			elemAfter,
			isDisabled,
			isSelected,
			elemBefore,
			actionsOnHover,
			onClick,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHasPopup,
			interactionName,
			isContentTooltipDisabled,
			visualContentRef,
			listItemRef,
			isDragging,
			hasDragIndicator,
			dropIndicator,
		},
		forwardedRef,
	) => {
		return (
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
					ariaControls={
						fg('platform-dst-buttonmenuitem-selected-state-support') ? ariaControls : undefined
					}
					ariaExpanded={
						fg('platform-dst-buttonmenuitem-selected-state-support') ? ariaExpanded : undefined
					}
					ariaHasPopup={
						fg('platform-dst-buttonmenuitem-selected-state-support') ? ariaHasPopup : undefined
					}
					isSelected={
						fg('platform-dst-buttonmenuitem-selected-state-support') ? isSelected : undefined
					}
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
		);
	},
);
