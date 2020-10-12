import React from 'react';

import { NotificationIndicator } from '@atlaskit/notification-indicator';

import { AtlassianNavigation, Notifications } from '../src';

const NotificationsBadge = () => (
  <NotificationIndicator
    onCountUpdated={console.log}
    notificationLogProvider={Promise.resolve({}) as any}
  />
);

export default () => (
  <AtlassianNavigation
    label="site"
    renderProductHome={() => null}
    renderNotifications={() => (
      <Notifications badge={NotificationsBadge} tooltip="Notifications" />
    )}
    primaryItems={[]}
  />
);
