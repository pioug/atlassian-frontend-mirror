import React from 'react';
import { ListenerProps, FabricChannel } from '../types';

import processEvent from './process-event';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

export default function NavigationListener(props: ListenerProps) {
  return (
    <GenericAnalyticsListener
      {...props}
      channel={FabricChannel.navigation}
      processEvent={processEvent}
    />
  );
}
