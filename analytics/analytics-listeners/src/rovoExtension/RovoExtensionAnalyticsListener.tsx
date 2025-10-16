import React from 'react';
import { type ListenerProps, FabricChannel } from '../types';

import processEvent from './process-event';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

export default function RovoExtensionAnalyticsListener(props: ListenerProps) {
	return (
		<GenericAnalyticsListener
			{...props}
			channel={FabricChannel.rovoExtension}
			processEvent={processEvent}
		/>
	);
}