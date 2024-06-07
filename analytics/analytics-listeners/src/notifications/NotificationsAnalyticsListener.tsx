import React from 'react';
import { type ListenerProps, FabricChannel } from '../types';

import processEvent from './process-event';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

export default function NotificationsAnalyticsListener(props: ListenerProps) {
	return (
		<GenericAnalyticsListener
			{...props}
			channel={FabricChannel.notifications}
			processEvent={processEvent}
		/>
	);
}
