import React from 'react';
import { ListenerProps, FabricChannel } from '../types';
import { processEvent } from './process-event';
import GenericAnalyticsListener from '../GenericAnalyticsListener';

export default function MediaAnalyticsListener(props: ListenerProps) {
  return (
    <GenericAnalyticsListener
      {...props}
      channel={FabricChannel.media}
      processEvent={processEvent}
    />
  );
}
