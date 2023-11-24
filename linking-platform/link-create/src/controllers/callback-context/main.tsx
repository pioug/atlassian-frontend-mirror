import React, { useContext, useMemo } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import { CreatePayload } from '../../common/types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { getErrorType } from '../../common/utils/errors';
import { useExperience } from '../experience-tracker';

interface LinkCreateCallbackProviderProps {
  /**
   * This callback for when the resource has been successfully created.
   */
  onCreate?: (result: CreatePayload) => Promise<void> | void;

  /**
   * This callback for any errors
   */
  onFailure?: (error: unknown) => void;

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
  const experience = getBooleanFF(
    'platform.linking-platform.link-create.better-observability',
  )
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useExperience()
    : null;

  const handleCreate = useMemo(
    () => ({
      onCreate: async (result: CreatePayload) => {
        if (
          getBooleanFF(
            'platform.linking-platform.link-create.better-observability',
          )
        ) {
          /**
           * We consider the experience successful once we have
           * successfully created an object
           */
          experience?.success();
        }

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
    }),
    [createAnalyticsEvent, onCreate, experience],
  );

  const handleFailure = useMemo(
    () => ({
      onFailure: async (error: unknown) => {
        createAnalyticsEvent(
          createEventPayload('track.object.createFailed.linkCreate', {
            failureType: getErrorType(error),
          }),
        ).fire(ANALYTICS_CHANNEL);

        if (
          getBooleanFF(
            'platform.linking-platform.link-create.better-observability',
          )
        ) {
          experience?.failure(error);
        }

        onFailure && onFailure(error);
      },
    }),
    [createAnalyticsEvent, onFailure, experience],
  );

  const value = useMemo(
    () => ({
      onCancel,
      ...handleCreate,
      ...handleFailure,
    }),
    [onCancel, handleCreate, handleFailure],
  );

  return (
    <LinkCreateCallbackContext.Provider value={value}>
      {children}
    </LinkCreateCallbackContext.Provider>
  );
};

const useLinkCreateCallback = () => useContext(LinkCreateCallbackContext);

export { LinkCreateCallbackProvider, useLinkCreateCallback };
