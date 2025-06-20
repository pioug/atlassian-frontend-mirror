import React, { type ComponentType, forwardRef } from 'react';

import NotificationsIcon from '@atlaskit/icon/core/notification';

import { BadgeContainer } from '../../components/badge-container';

import { EndItem, type EndItemProps } from './end-item';

const NOTIFICATIONS_BADGE_ID = 'atlassian-navigation-notification-count';

interface NotificationsProps extends Omit<EndItemProps, 'icon'> {
	/**
	 * The component to render as the badge.
	 * You are recommended to use the Badge component from `@atlaskit/badge`.
	 */
	badge: ComponentType;
}

/**
 * __Notifications__
 *
 * The trigger button for the notifications menu in the top navigation bar.
 */
export const Notifications = forwardRef<HTMLButtonElement, NotificationsProps>(
	function Notifications(
		{
			label,
			onClick,
			onMouseEnter,
			isSelected,
			testId,
			interactionName,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHasPopup,
			isListItem,
			badge,
		},
		ref,
	) {
		return (
			<BadgeContainer
				id={NOTIFICATIONS_BADGE_ID}
				badge={badge}
				// We only need to set the list item role on the top level element (BadgeContainer)
				isListItem={isListItem}
			>
				<EndItem
					label={label}
					onClick={onClick}
					onMouseEnter={onMouseEnter}
					isSelected={isSelected}
					testId={testId}
					interactionName={interactionName}
					aria-controls={ariaControls}
					aria-expanded={ariaExpanded}
					aria-haspopup={ariaHasPopup}
					ref={ref}
					icon={NotificationsIcon}
					// We explicitly set the EndItem to not be a list item,
					// because the BadgeContainer already has a list item role (if `isListItem` is true)
					isListItem={false}
				/>
			</BadgeContainer>
		);
	},
);
