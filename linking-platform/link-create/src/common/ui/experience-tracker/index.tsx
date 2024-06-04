import React, { createContext, useContext, useMemo, useRef } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { captureException } from '@atlaskit/linking-common/sentry';

import { ANALYTICS_CHANNEL } from '../../constants';
import createEventPayload from '../../utils/analytics/analytics.codegen';
import { getErrorType, getNetworkFields } from '../../utils/errors';

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
 * Error message matches to ignore
 * These should not affect our SLOs as there's nothing we can do about them
 */
const IGNORE_ERROR_MESSAGES = [/failed to fetch/i];

/**
 * Returns false for errors that should not be considered failures of our SLO
 * because they are failures only the user can handle.
 */
const isErrorSLOFailure = (error: unknown) => {
  if (error instanceof Error) {
    if (IGNORE_ERROR_MESSAGES.some(msg => msg.test(error.message))) {
      return false;
    }
  }
  return true;
};

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
          createEventPayload('operational.linkCreateExperience.failed', {
            /**
             * The type of error that has failed the experience
             */
            errorType: getErrorType(error),
            /**
             * Error message if instanceof Error
             */
            errorMessage: error instanceof Error ? error.message : null,
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
             * Whether the failure should be involved when considering SLI/SLO
             */
            isSLOFailure: isErrorSLOFailure(error),
            /**
             * Fields related to `Response` object that can help with debugging
             * what has gone wrong
             */
            ...getNetworkFields(error),
          }),
        ).fire(ANALYTICS_CHANNEL);

        if (error instanceof Error) {
          // Capture exception to Sentry
          captureException(error, 'link-create');
        }

        /**
         * Only consider the experience truly failed if the
         * failure is one we haven't correctly handled.
         *
         * In otherwords allow the experience to be "restarted" for the user to try again
         */
        if (isErrorSLOFailure(error)) {
          if (experience.current !== experienceStatus) {
            experience.current = experienceStatus;
          }
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
