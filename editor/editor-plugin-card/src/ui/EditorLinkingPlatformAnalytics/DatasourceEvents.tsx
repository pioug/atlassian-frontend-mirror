import { useEffect, useMemo } from 'react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { useDatasourceLifecycleAnalytics } from '@atlaskit/link-analytics';
import type { DatasourceAdf } from '@atlaskit/link-datasource';

import type {
  DatasourceCreatedEvent,
  DatasourceDeletedEvent,
  DatasourceUpdatedEvent,
} from '../../analytics/types';
import { EVENT, EVENT_SUBJECT } from '../../analytics/types';

import type { AnalyticsBindingsProps } from './common';
import { getMethod } from './common';

type EventHandlers = {
  [EVENT.CREATED]: (data: DatasourceCreatedEvent['data']) => void;
  [EVENT.UPDATED]: (data: DatasourceUpdatedEvent['data']) => void;
  [EVENT.DELETED]: (data: DatasourceDeletedEvent['data']) => void;
};

type Metadata = Parameters<typeof getMethod>[0];

function getDatasourceDisplay(datasourceAttrs: DatasourceAdf['attrs']) {
  return datasourceAttrs.datasource.views[0]?.type;
}

function getDisplayedColumnCount(datasourceAttrs: DatasourceAdf['attrs']) {
  return datasourceAttrs.datasource.views[0]?.properties?.columns?.length ?? 0;
}

function getSearchMethod(
  creationMethod: string | undefined,
  metadata: Metadata,
) {
  if (creationMethod === 'editor_paste' || creationMethod === 'editor_type') {
    return '';
  }
  const { sourceEvent } = metadata;
  if (sourceEvent instanceof UIAnalyticsEvent) {
    const event = sourceEvent as UIAnalyticsEvent;
    return event.payload.attributes?.searchMethod;
  }
  return 'unknown';
}

function getAnalyticAttributesFromNode(
  datasourceAttrs: DatasourceAdf['attrs'],
  metadata: Metadata,
) {
  const {
    url,
    datasource: { id: datasourceId, parameters },
  } = datasourceAttrs;
  const display = getDatasourceDisplay(datasourceAttrs);
  let inputMethod = '';
  let actions = [];
  if (metadata.inputMethod) {
    inputMethod = getMethod(metadata) ?? '';
  } else if (metadata.sourceEvent instanceof UIAnalyticsEvent) {
    inputMethod = metadata.sourceEvent.payload.attributes?.inputMethod;
    actions = metadata.sourceEvent.payload.attributes?.actions;
  }
  const displayedColumnCount = getDisplayedColumnCount(datasourceAttrs);
  const searchMethod = getSearchMethod(inputMethod, metadata);

  return {
    actions,
    inputMethod,
    datasourceId,
    display,
    displayedColumnCount,
    parameters,
    searchMethod,
    url,
  };
}

/**
 * Subscribes to the events occuring in the card
 * plugin and fires analytics events accordingly
 */
export const DatasourceEventsBinding = ({
  cardPluginEvents,
}: AnalyticsBindingsProps) => {
  const { datasourceCreated, datasourceUpdated, datasourceDeleted } =
    useDatasourceLifecycleAnalytics();
  const eventHandlers = useMemo((): EventHandlers => {
    return {
      [EVENT.CREATED]: ({ node, nodeContext, ...metadata }) => {
        const attributes = getAnalyticAttributesFromNode(
          node.attrs as DatasourceAdf['attrs'],
          metadata,
        );

        const {
          actions,
          inputMethod,
          datasourceId,
          display,
          displayedColumnCount,
          parameters,
          searchMethod,
          url,
        } = attributes;

        datasourceCreated({ datasourceId, parameters, url }, null, {
          actions,
          creationMethod: inputMethod,
          display,
          displayedColumnCount,
          nodeContext: nodeContext,
          searchMethod,
        });
      },
      [EVENT.UPDATED]: ({ node, nodeContext, ...metadata }) => {
        const attributes = getAnalyticAttributesFromNode(
          node.attrs as DatasourceAdf['attrs'],
          metadata,
        );

        const {
          actions,
          datasourceId,
          display,
          displayedColumnCount,
          inputMethod,
          parameters,
          searchMethod,
          url,
        } = attributes;

        datasourceUpdated({ datasourceId, parameters, url }, null, {
          actions,
          display,
          displayedColumnCount,
          nodeContext: nodeContext,
          searchMethod,
          updateMethod: inputMethod,
        });
      },
      [EVENT.DELETED]: ({ node, nodeContext, ...metadata }) => {
        const attributes = getAnalyticAttributesFromNode(
          node.attrs as DatasourceAdf['attrs'],
          metadata,
        );

        const {
          datasourceId,
          display,
          displayedColumnCount,
          inputMethod,
          parameters,
          searchMethod,
          url,
        } = attributes;

        datasourceDeleted({ datasourceId, parameters, url }, null, {
          deleteMethod: inputMethod,
          display,
          displayedColumnCount,
          nodeContext: nodeContext,
          searchMethod,
        });
      },
    };
  }, [datasourceCreated, datasourceUpdated, datasourceDeleted]);

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
