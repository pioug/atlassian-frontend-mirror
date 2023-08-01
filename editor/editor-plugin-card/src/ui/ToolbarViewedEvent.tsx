import React, { useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { getResolvedAttributes } from '@atlaskit/link-analytics/resolved-attributes';
import type { CardContext } from '@atlaskit/link-provider';

import { CardContextProvider } from './CardContextProvider';
import {
  EditorAnalyticsContext,
  EditorAnalyticsContextProps,
} from './EditorAnalyticsContext';

type ToolbarViewedEventProps = {
  url?: string;
  display: string | null;
};

const getResolvedAttributesFromStore = (
  url: string,
  display: string | null,
  store?: CardContext['store'],
) => {
  if (!store) {
    return {};
  }

  const urlState = store.getState()[url];
  const displayCategory = display === 'url' ? 'link' : undefined;

  return getResolvedAttributes({ url, displayCategory }, urlState?.details);
};

/**
 * Handles firing the toolbar viewed event
 */
const ToolbarViewedEventBase = ({
  url,
  display,
  cardContext,
}: Required<ToolbarViewedEventProps> & {
  cardContext?: CardContext;
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const store = cardContext?.store;

  useEffect(() => {
    createAnalyticsEvent({
      action: 'viewed',
      actionSubject: 'inlineDialog',
      actionSubjectId: 'editLinkToolbar',
      eventType: 'ui',
      attributes: {
        ...getResolvedAttributesFromStore(url, display, store),
        display,
      },
    }).fire('media');
  }, [createAnalyticsEvent, display, url, store]);

  return null;
};

/**
 * Provides analytics context and card context
 */
export const ToolbarViewedEvent = ({
  url,
  display,
  editorView,
}: ToolbarViewedEventProps & Omit<EditorAnalyticsContextProps, 'children'>) => {
  return (
    <EditorAnalyticsContext editorView={editorView}>
      <CardContextProvider>
        {({ cardContext }) =>
          url ? (
            <ToolbarViewedEventBase
              url={url}
              display={display}
              cardContext={cardContext}
            />
          ) : null
        }
      </CardContextProvider>
    </EditorAnalyticsContext>
  );
};
