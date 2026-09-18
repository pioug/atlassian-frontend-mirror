import React from 'react';

import GenericAnalyticsListener from '../GenericAnalyticsListener';
import { type ListenerProps, FabricChannel } from '../types';
import processEvent from './process-event';

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
