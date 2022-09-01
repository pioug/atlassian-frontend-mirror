import { useCallback } from 'react';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { createSmartLinkPayload } from './analytics';
import { SmartLinkAnalyticsAttributes, SmartLinkDetails } from './types';

const ANALYTICS_CHANNEL = 'media';

export const useSmartLinkLifecycleAnalytics = () => {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  /**
   * This event represents an instance where a Smart Link is created.
   * @param smartLinkDetails
   * @param payload
   */
  const createSmartLink = useCallback(
    (_details: SmartLinkDetails, attributes: SmartLinkAnalyticsAttributes) =>
      createAnalyticsEvent({ attributes, ...createSmartLinkPayload }).fire(
        ANALYTICS_CHANNEL,
      ),
    [createAnalyticsEvent],
  );

  return { createSmartLink };
};
