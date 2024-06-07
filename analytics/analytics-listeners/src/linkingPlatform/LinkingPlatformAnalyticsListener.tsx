import React from 'react';

import processEvent from './process-event';
import { type ListenerProps, FabricChannel } from '../types';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

export default function LinkingPlatformAnalyticsListener(props: ListenerProps) {
	return (
		<GenericAnalyticsListener
			{...props}
			channel={FabricChannel.linkingPlatform}
			processEvent={processEvent}
		/>
	);
}
