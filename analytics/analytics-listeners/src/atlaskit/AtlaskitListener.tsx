import React from 'react';

import GenericAnalyticsListener from '../GenericAnalyticsListener';
import { type ListenerProps, FabricChannel } from '../types';
import processEvent from './process-event';

export default function AtlaskitListener(props: ListenerProps): React.JSX.Element {
	return (
		<GenericAnalyticsListener
			{...props}
			channel={FabricChannel.atlaskit}
			processEvent={processEvent}
		/>
	);
}
