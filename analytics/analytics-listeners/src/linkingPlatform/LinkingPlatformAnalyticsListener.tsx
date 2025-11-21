import React from 'react';

import processEvent from './process-event';
import { type ListenerProps, FabricChannel } from '../types';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

export default function LinkingPlatformAnalyticsListener(props: ListenerProps): React.JSX.Element {
	return (
		<GenericAnalyticsListener
			{...props}
			channel={FabricChannel.linkingPlatform}
			processEvent={processEvent}
		/>
	);
}
