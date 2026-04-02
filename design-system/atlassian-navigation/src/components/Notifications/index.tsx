import React, { forwardRef, type Ref } from 'react';

import { cssMap } from '@atlaskit/css';
import NotificationIcon from '@atlaskit/icon/core/notification';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';


import { BadgeContainer } from '../BadgeContainer';
import { IconButton } from '../IconButton';

import { type NotificationsProps } from './types';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const NOTIFICATIONS_BADGE_ID = 'atlassian-navigation-notification-count';

/**
 * __Notifications__
 *
 * A notifications button that can be passed into `AtlassianNavigation`'s
 * `renderNotifications` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#notifications)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
export const Notifications: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<NotificationsProps> & React.RefAttributes<any>
> = forwardRef((props: NotificationsProps, ref: Ref<any>) => {
	const {
		badge,
		component,
		href,
		id,
		isDisabled,
		isSelected,
		label,
		onBlur,
		onClick,
		onFocus,
		onMouseDown,
		onMouseEnter,
		onMouseLeave,
		onMouseUp,
		target,
		testId,
		tooltip,
		...rest
	} = props;

	return (
		<BadgeContainer id={NOTIFICATIONS_BADGE_ID} badge={badge} role="listitem">
			<IconButton
				aria-describedby={NOTIFICATIONS_BADGE_ID}
				component={component}
				href={href}
				icon={
					<Flex xcss={iconSpacingStyles.space050}>
						<NotificationIcon
							color="currentColor"
							label={typeof tooltip === 'string' ? tooltip : 'Notification Icon'}
						/>
					</Flex>
				}
				id={id}
				isDisabled={isDisabled}
				isSelected={isSelected}
				label={label}
				onBlur={onBlur}
				onClick={onClick}
				onFocus={onFocus}
				onMouseDown={onMouseDown}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onMouseUp={onMouseUp}
				ref={ref}
				target={target}
				testId={testId}
				tooltip={tooltip}
				isTooltipAnnouncementDisabled
				// These are all explicit, leaving it in just in case
				{...rest}
			/>
		</BadgeContainer>
	);
});
