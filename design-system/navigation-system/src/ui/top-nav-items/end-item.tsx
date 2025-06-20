import React, { forwardRef, Fragment } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type IconButtonProps } from '@atlaskit/button/new';
import type { TriggerProps } from '@atlaskit/popup/types';

import { ListItem } from '../../components/list-item';

import { IconButton } from './themed/migration';

export interface EndItemProps
	extends Partial<Pick<TriggerProps, 'aria-controls' | 'aria-expanded' | 'aria-haspopup'>> {
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label: React.ReactNode;
	/**
	 * Places an icon within the button.
	 */
	icon: IconButtonProps['icon'];
	/**
	 * Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels.
	 * They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for
	 * information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics)
	 * or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).
	 */
	onClick?: (e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * Called when the mouse enters the element container.
	 * Allows preloading popup components
	 */
	onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
	/**
	 * Indicates that the button is selected.
	 */
	isSelected?: boolean;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;

	/**
	 * Can be used to disable the default `listitem` role.
	 *
	 * This is intended for when the item is a popup trigger,
	 * and requires you to render your own `<MenuListItem>` to wrap the action.
	 *
	 * @default true
	 *
	 * @example
	 * ```tsx
	 * <TopNavEnd>
	 *		<MenuListItem>
	 *			<DropdownMenu
	 *				shouldRenderToParent
	 *				trigger={({ triggerRef, ...props }) => (
	 *					<Profile {...props} ref={triggerRef} label="Profile" isListItem={false}  />
	 *				)}
	 *			>
	 *				<DropdownItemGroup>
	 *					<DropdownItem>Account</DropdownItem>
	 *				</DropdownItemGroup>
	 *			</DropdownMenu>
	 *		</MenuListItem>
	 * </TopNavEnd>
	 * ```
	 */
	isListItem?: boolean;
}

/**
 * __EndItem__
 *
 * An icon button for the `TopNavEnd` layout area of the top navigation. Used for adding custom actions that are not already provided.
 *
 * For common actions, like `Notifications`, `Help`, `Profile`, `Settings`, use the provided components as appropriate.
 */
export const EndItem = forwardRef<HTMLButtonElement, EndItemProps>(
	(
		{
			label,
			icon,
			onClick,
			onMouseEnter,
			isSelected,
			testId,
			interactionName,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHasPopup,
			isListItem = true,
		}: EndItemProps,
		forwardedRef,
	) => {
		const Wrapper = isListItem ? ListItem : Fragment;
		return (
			<Wrapper>
				<IconButton
					ref={forwardedRef}
					icon={icon}
					label={label}
					onClick={onClick}
					onMouseEnter={onMouseEnter}
					appearance="subtle"
					isSelected={isSelected}
					isTooltipDisabled={false}
					testId={testId}
					interactionName={interactionName}
					aria-controls={ariaControls}
					aria-expanded={ariaExpanded}
					aria-haspopup={ariaHasPopup}
				/>
			</Wrapper>
		);
	},
);
