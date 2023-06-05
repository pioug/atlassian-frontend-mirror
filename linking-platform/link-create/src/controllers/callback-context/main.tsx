import React, { useContext, useMemo } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';

interface LinkCreateCallbackProviderProps {
  /**
   * This callback for when the resource has been successfully created.
   */
  onCreate?: (result: {
    url: string;
    objectId: string;
    objectType: string;
  }) => Promise<void> | void;

  /**
   * This callback for any errors
   */
  onFailure?: (errorMessage: string) => void;

  /**
   * This callback for when the form was manually discarded by user
   */
  onCancel?: () => void;
}

const LinkCreateCallbackContext =
  React.createContext<LinkCreateCallbackProviderProps>({});

const LinkCreateCallbackProvider: React.FC<LinkCreateCallbackProviderProps> = ({
  children,
  onCreate,
  onFailure,
  onCancel,
}) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const value = useMemo(
    () => ({
      onCreate: async (result: {
        url: string;
        objectId: string;
        objectType: string;
      }) => {
        const { objectId, objectType } = result;
        createAnalyticsEvent(
          createEventPayload('track.object.created.linkCreate', {
            objectId,
            objectType,
          }),
        ).fire(ANALYTICS_CHANNEL);
        if (onCreate) {
          await onCreate(result);
        }
      },
      onFailure,
      onCancel,
    }),
    [onFailure, onCancel, createAnalyticsEvent, onCreate],
  );

  return (
    <LinkCreateCallbackContext.Provider value={value}>
      {children}
    </LinkCreateCallbackContext.Provider>
  );
};

const useLinkCreateCallback = () => useContext(LinkCreateCallbackContext);

export { LinkCreateCallbackProvider, useLinkCreateCallback };
