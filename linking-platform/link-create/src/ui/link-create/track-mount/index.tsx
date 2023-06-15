/** @jsx jsx */
import { useLayoutEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../common/constants';
import createEventPayload from '../../../common/utils/analytics/analytics.codegen';

/**
 * Analytics tracking for component mount (and unmount)
 */
function TrackMount() {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  useLayoutEffect(() => {
    // Anything in here is fired on component mount.
    createAnalyticsEvent(
      createEventPayload('screen.linkCreateScreen.viewed', {}),
    ).fire(ANALYTICS_CHANNEL);

    return () => {
      // Anything in here is fired on component unmount.
      createAnalyticsEvent(
        createEventPayload('ui.modalDialog.closed.linkCreate', {}),
      ).fire(ANALYTICS_CHANNEL);
    };
  }, [createAnalyticsEvent]);

  return null;
}

export default TrackMount;
