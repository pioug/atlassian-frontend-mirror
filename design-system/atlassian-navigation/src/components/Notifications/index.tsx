import React, { forwardRef, Ref } from 'react';

import NotificationIcon from '@atlaskit/icon/glyph/notification';

import { BadgeContainer } from '../BadgeContainer';
import { IconButton } from '../IconButton';

import { NotificationsProps } from './types';

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
export const Notifications = forwardRef(
  (props: NotificationsProps, ref: Ref<any>) => {
    const { badge, tooltip, ...iconButtonProps } = props;

    return (
      <BadgeContainer id={NOTIFICATIONS_BADGE_ID} badge={badge} role="listitem">
        <IconButton
          icon={
            <NotificationIcon
              label={
                typeof tooltip === 'string' ? tooltip : 'Notification Icon'
              }
            />
          }
          tooltip={tooltip}
          ref={ref}
          aria-describedby={NOTIFICATIONS_BADGE_ID}
          {...iconButtonProps}
        />
      </BadgeContainer>
    );
  },
);

export default Notifications;
