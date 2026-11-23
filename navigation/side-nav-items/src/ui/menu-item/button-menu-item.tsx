import React, { forwardRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { MenuItemBase } from './menu-item';
import { MenuListItem } from './menu-list-item';
import type {
	MenuItemAriaHasPopup,
	MenuItemLinkOrButtonCommonProps,
	MenuItemOnClick,
} from './types';

export type ButtonMenuItemProps = MenuItemLinkOrButtonCommonProps & {
	/**
	 * Identifies the popup or tab panel that this element controls.
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
	'aria-haspopup'?: MenuItemAriaHasPopup;

	/** The ID of the button, for associating a tab panel with its tab. */
	id?: string;

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

	/** Called when the button receives focus. */
	onFocus?: React.FocusEventHandler<HTMLButtonElement>;

	/** Called when a key is pressed on the button. */
	onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;

	/**
	 * Opt into tab semantics: a presentational wrapper and a button with role="tab"
	 * and aria-selected derived from isSelected. Only the selected tab is in the
	 * tab order. The parent owns the tablist, panels, and keyboard navigation.
	 * Use type="location" for a notch.
	 */
	semantics?: 'tab';

	/**
	 * The purpose of the item. `default` performs an action without selected styling;
	 * `popup` is highlighted while `aria-expanded` is true; `location` shows a notch
	 * when `isSelected` is true. Omit to preserve the legacy `isSelected` appearance.
	 */
	type?: 'default' | 'popup' | 'location';
};

/**
 * __ButtonMenuItem__
 *
 * A menu item button. Use within a list, or a tablist with `semantics="tab"`.
 */
export const ButtonMenuItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<ButtonMenuItemProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, ButtonMenuItemProps>(
	(
		{
			type,
			semantics,
			id,
			onFocus,
			onKeyDown,
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
		const isTypesEnabled = fg('navx_button_menu_item_types');
		const isTab = isTypesEnabled && semantics === 'tab';
		const tabIndex = isSelected ? 0 : -1;
		let isItemSelected = isSelected;
		if (isTypesEnabled) {
			if (type === 'default') {
				isItemSelected = false;
			} else if (type === 'popup') {
				isItemSelected = ariaExpanded;
			}
		}

		return (
			<MenuListItem ref={listItemRef} role={isTab ? 'none' : 'listitem'}>
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
					ariaControls={ariaControls}
					ariaExpanded={ariaExpanded}
					ariaHasPopup={ariaHasPopup}
					isSelected={isItemSelected}
					hasSelectedIndicator={isTypesEnabled && type === 'location'}
					buttonProps={
						isTypesEnabled
							? {
									id,
									tabIndex: isTab ? tabIndex : undefined,
									onFocus,
									onKeyDown,
									role: isTab ? 'tab' : undefined,
									'aria-selected': isTab ? Boolean(isSelected) : undefined,
									'aria-current': !isTab && type === 'location' && isSelected ? 'page' : undefined,
								}
							: undefined
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
