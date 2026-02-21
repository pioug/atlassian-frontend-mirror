import React, { forwardRef, type ReactNode, useEffect, useRef } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import useControlled from '@atlaskit/ds-lib/use-controlled';
import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';
import { fg } from '@atlaskit/platform-feature-flags';
import { Popup } from '@atlaskit/popup/experimental';

import { MenuListItem } from '../menu-list-item';

import type { FlyoutCloseSource } from './flyout-menu-item-content';
import { IsOpenContext, OnCloseContext, SetIsOpenContext } from './flyout-menu-item-context';

export type FlyoutMenuItemProps = {
	/**
	 * Should contain `FlyoutMenuItemTrigger` and `FlyoutMenuItemContent`.
	 */
	children: ReactNode;
	/**
	 * ID that is assigned to the popup container element and used to associate the trigger with the content.
	 */
	id?: string;
	/**
	 * Whether the flyout menu is open by default.
	 *
	 * You can use this to set the default expansion state without needing to entirely control the state.
	 */
	isDefaultOpen?: boolean;
	/**
	 * Allows to control the open state of the flyout externally.
	 *
	 * If you are controlling the state, you should update your state using:
	 * - `onClick` on the `FlyoutMenuItemTrigger`
	 * - `onClose` on the `FlyoutMenuItemContent`
	 */
	isOpen?: boolean;
	/**
	 * Callback that is called when the flyout menu is opened or closed.
	 *
	 * Can be used for analytics purposes when you are not controlling the state yourself.
	 */
	onOpenChange?: (isOpen: boolean) => void;
};

/**
 * __FlyoutMenuItem__
 *
 * Displays content in a flyout menu, triggered by a button.
 *
 * The top-level component that contains the trigger and content of a flyout menu.
 *
 * Usage example:
 * ```tsx
 * <FlyoutMenuItem>
 *   <FlyoutMenuItemTrigger>Trigger</FlyoutMenuItemTrigger>
 *   <FlyoutMenuItemContent>
 *     <MenuList>
 *       <ButtonMenuItem>Item 1</ButtonMenuItem>
 *       <ButtonMenuItem>Item 2</ButtonMenuItem>
 *     </MenuList>
 *   </FlyoutMenuItemContent>
 * </FlyoutMenuItem>
 * ```
 */
export const FlyoutMenuItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<FlyoutMenuItemProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, FlyoutMenuItemProps>(
	(
		{ children, id, isOpen: isOpenControlled, isDefaultOpen = false, onOpenChange },
		forwardedRef,
	) => {
		const [isOpen, setIsOpen] = useControlled(isOpenControlled, () => isDefaultOpen);

		const previousIsOpen = usePreviousValue(isOpen);
		const onCloseRef =
			useRef<
				(
					event: Event | React.MouseEvent<HTMLButtonElement> | KeyboardEvent | MouseEvent | null,
					source?: FlyoutCloseSource,
				) => void
			>(null);

		const { createAnalyticsEvent } = useAnalyticsEvents();

		useEffect(() => {
			if (previousIsOpen === undefined || previousIsOpen === isOpen) {
				/**
				 * The previous value is `undefined` on initialization, so if it is `undefined` then the value hasn't changed.
				 *
				 * The previous value can be equal to the current one if the component re-renders due to something else changing.
				 *
				 * In both cases the value hasn't changed and we don't want to notify consumers.
				 */
				return;
			}

			// When flyout menu is opened, fire analytics event
			if (isOpen && previousIsOpen === false) {
				if (fg('platform_dst_nav4_flyout_menu_slots_close_button')) {
					const navigationAnalyticsEvent = createAnalyticsEvent({
						source: 'sideNav',
						actionSubject: 'flyoutMenu',
						action: 'opened',
					});

					navigationAnalyticsEvent.fire('navigation');
				}
			}

			onOpenChange?.(isOpen);
		}, [isOpen, onOpenChange, previousIsOpen, createAnalyticsEvent]);

		return (
			<IsOpenContext.Provider value={isOpen}>
				<SetIsOpenContext.Provider value={setIsOpen}>
					<OnCloseContext.Provider value={onCloseRef}>
						<MenuListItem ref={forwardedRef}>
							<Popup
								id={id}
								isOpen={isOpen}
								role={fg('platform_dst_nav4_flyout_menu_slots_close_button') ? 'dialog' : undefined}
							>
								{children}
							</Popup>
						</MenuListItem>
					</OnCloseContext.Provider>
				</SetIsOpenContext.Provider>
			</IsOpenContext.Provider>
		);
	},
);
