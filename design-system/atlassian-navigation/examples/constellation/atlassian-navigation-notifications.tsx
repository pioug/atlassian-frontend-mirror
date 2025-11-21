import React from 'react';

import { AtlassianNavigation, Notifications } from '@atlaskit/atlassian-navigation';
import { NotificationIndicator } from '@atlaskit/notification-indicator';

const NotificationsBadge = () => (
	<NotificationIndicator
		onCountUpdated={console.log}
		notificationLogProvider={Promise.resolve({}) as any}
	/>
);

const NotificationsExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderNotifications={() => <Notifications badge={NotificationsBadge} tooltip="Notifications" />}
		primaryItems={[]}
	/>
);

export default NotificationsExample;
