import { useCallback } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { type JqlAnalyticsEvent } from './types';

export const useJqlPackageAnalytics = <Action, ActionSubject, ActionSubjectId>(
  analyticsSource: string,
  packageName: string,
  packageVersion: string,
  analyticsChannel: string,
) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const createAndFireAnalyticsEvent = useCallback(
    (payload: JqlAnalyticsEvent<Action, ActionSubject, ActionSubjectId>) => {
      const event = createAnalyticsEvent({
        ...payload,
        attributes: {
          ...payload.attributes,
          analyticsSource,
          packageName,
          packageVersion,
        },
      });
      event.fire(analyticsChannel);
    },
    [
      createAnalyticsEvent,
      analyticsSource,
      packageName,
      packageVersion,
      analyticsChannel,
    ],
  );

  return { createAndFireAnalyticsEvent };
};
