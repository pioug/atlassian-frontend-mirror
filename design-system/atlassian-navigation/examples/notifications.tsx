import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { Notifications } from '@atlaskit/atlassian-navigation/notifications';
import { NotificationIndicator } from '@atlaskit/notification-indicator';

const NotificationsBadge = () => (
	<NotificationIndicator
		onCountUpdated={console.log}
		notificationLogProvider={Promise.resolve({}) as any}
	/>
);

export default (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderNotifications={() => <Notifications badge={NotificationsBadge} tooltip="Notifications" />}
		primaryItems={[]}
	/>
);
