import React from 'react';
import { type ListenerProps, FabricChannel } from '../types';

import processEvent from './process-event';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

export default function CrossFlowAnalyticsListener(props: ListenerProps) {
	return (
		<GenericAnalyticsListener
			{...props}
			channel={FabricChannel.crossFlow}
			processEvent={processEvent}
		/>
	);
}
