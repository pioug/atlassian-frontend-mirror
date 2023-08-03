import { useEffect, useMemo } from 'react';

import {
  DatasourceCreatedEvent,
  DatasourceDeletedEvent,
  DatasourceUpdatedEvent,
  EVENT,
  EVENT_SUBJECT,
} from '../../analytics/types';

import { AnalyticsBindingsProps } from './common';

type EventHandlers = {
  [EVENT.CREATED]: (data: DatasourceCreatedEvent['data']) => void;
  [EVENT.UPDATED]: (data: DatasourceUpdatedEvent['data']) => void;
  [EVENT.DELETED]: (data: DatasourceDeletedEvent['data']) => void;
};

/**
 * Subscribes to the events occuring in the card
 * plugin and fires analytics events accordingly
 */
export const DatasourceEventsBinding = ({
  cardPluginEvents,
}: AnalyticsBindingsProps) => {
  const eventHandlers = useMemo((): EventHandlers => {
    return {
      [EVENT.CREATED]: metadata => {
        // TODO Impl as part of https://product-fabric.atlassian.net/browse/EDM-7072
        // eslint-disable-next-line no-console
        console.log('CREATED', metadata.node, metadata.nodeContext);
      },
      [EVENT.UPDATED]: metadata => {
        // TODO Impl as part of https://product-fabric.atlassian.net/browse/EDM-7072
        // eslint-disable-next-line no-console
        console.log('UPDATED', metadata.node, metadata.nodeContext);
      },
      [EVENT.DELETED]: metadata => {
        // TODO Impl as part of https://product-fabric.atlassian.net/browse/EDM-7072
        // eslint-disable-next-line no-console
        console.log('DELETED', metadata.node, metadata.nodeContext);
      },
    };
  }, []);

  /**
   * Subscribe to datasource events
   */
  useEffect(() => {
    const unsubscribe = cardPluginEvents.subscribe(
      ({ event, subject, data }) => {
        if (subject === EVENT_SUBJECT.DATASOURCE) {
          eventHandlers[event](data);
        }
      },
    );

    return () => unsubscribe();
  }, [eventHandlers, cardPluginEvents]);

  return null;
};
