import React from 'react';

import NotificationIcon from '@atlaskit/icon/core/migration/notification';
import Nav4NotificationsIcon from '@atlaskit/icon/core/notification';
import { token } from '@atlaskit/tokens';

import { SkeletonIconButton } from './components/SkeletonIconButton';

export type SkeletonNotificationButtonProps = {
	/**
	 *  Describes the specific role of this navigation component for users viewing the page with a screen
	 *  reader. Use this to differentiate the buttons from other navigation buttons on a page.
	 */
	label: string;
};

/**
 * __Skeleton notification button__
 *
 * Skeleton buttons are lightweight HTML button elements with CSS that represent
 * their heavier interactive counterparts, for use when elements of the
 * navigation are loaded dynamically. This one represents the Notification button.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#skeleton-button)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const SkeletonNotificationButton = ({ label = '' }: SkeletonNotificationButtonProps) => (
	<SkeletonIconButton>
		<NotificationIcon color="currentColor" spacing="spacious" label={label} />
	</SkeletonIconButton>
);

/**
 * __Nav 4 skeleton notification button__
 *
 * A nav 4 skeleton notification button.
 *
 */
export const Nav4SkeletonNotificationButton = ({ label = '' }: SkeletonNotificationButtonProps) => (
	<SkeletonIconButton>
		<Nav4NotificationsIcon label={label} color={token('color.icon')} />
	</SkeletonIconButton>
);
