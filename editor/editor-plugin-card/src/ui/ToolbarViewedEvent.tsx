import React, { useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import type { CardContext } from '@atlaskit/link-provider';

import { getResolvedAttributesFromStore } from '../utils';

import { CardContextProvider } from './CardContextProvider';
import type { EditorAnalyticsContextProps } from './EditorAnalyticsContext';
import { EditorAnalyticsContext } from './EditorAnalyticsContext';

type ToolbarViewedEventProps = {
  url?: string;
  display: string | null;
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
