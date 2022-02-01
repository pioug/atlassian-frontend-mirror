import React from 'react';
import { ListenerProps, FabricChannel } from '../types';

import processEvent from './process-event';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

export default function RecentWorkAnalyticsListener(props: ListenerProps) {
  return (
    <GenericAnalyticsListener
      {...props}
      channel={FabricChannel.recentWork}
      processEvent={processEvent}
    />
  );
}
