import React from 'react';
import { type ListenerProps, FabricChannel } from '../types';

import processEvent from './process-event';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

const OmniChannelAnalyticsListener = (props: ListenerProps): React.JSX.Element => {
	return (
		<GenericAnalyticsListener
			{...props}
			channel={FabricChannel.omniChannel}
			processEvent={processEvent}
		/>
	);
};

export default OmniChannelAnalyticsListener;
