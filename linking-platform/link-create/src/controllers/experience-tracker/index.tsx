import React, { createContext, useContext, useMemo, useRef } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { captureException } from '@atlaskit/linking-common/sentry';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { ANALYTICS_CHANNEL } from '../../common/constants';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { getErrorType, getNetworkFields } from '../../common/utils/errors';

export type ExperienceProps = {
  children: React.ReactNode;
};

type Status = 'STARTED' | 'FAILED' | 'SUCCEEDED';

type ExperienceContextValue = {
  /**
   * Mark the experience as successful.
   */
  success: () => void;
  /**
   * Mark the experience as failed.
   * Sends an analytics event to track experience as failed.
   */
  failure: (error: unknown) => void;
};

const ExperienceContext = createContext<ExperienceContextValue>({
  success: () => {},
  failure: () => {},
});

/**
 * Experience provider that simply keeps track of the state of the experience.
 * Fires an operational event when experience state changes to FAILED.
 */
export const Experience = ({ children }: ExperienceProps) => {
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const experience = useRef<Status>('STARTED');

  const value = useMemo(
    () => ({
      success: () => {
        if (experience.current !== 'SUCCEEDED') {
          experience.current = 'SUCCEEDED';
        }
      },
      /**
       * Indicate the experience has failed and capture exception information
       * @param error Typically an Error class or Response class
       */
      failure: (error: unknown) => {
        const experienceStatus = 'FAILED';

        /**
         * Always capture an event to Splunk
         */
        createAnalyticsEvent(
          createEventPayload('operational.operation.failed.linkCreate', {
            /**
             * The type of error that has failed the experience
             */
            errorType: getErrorType(error),
            /**
             * The current status of the experience (has failed)
             */
            experienceStatus,
            /**
             * Previous experience status indicates whether the experience
             * has just failed now, or has already failing
             */
            previousExperienceStatus: experience.current,
            /**
             * Fields related to `Response` object that can help with debugging
             * what has gone wrong
             */
            ...getNetworkFields(error),
          }),
        ).fire(ANALYTICS_CHANNEL);

        if (error instanceof Error) {
          if (
            getBooleanFF(
              'platform.linking-platform.link-create.enable-sentry-client',
            )
          ) {
            // Capture exception to Sentry
            captureException(error, 'link-create');
          }
        }

        if (experience.current !== experienceStatus) {
          experience.current = experienceStatus;
        }
      },
    }),
    [experience, createAnalyticsEvent],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperience = () => useContext(ExperienceContext);
