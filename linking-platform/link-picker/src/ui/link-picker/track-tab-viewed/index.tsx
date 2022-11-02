/** @jsx jsx */
import { useLayoutEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import createEventPayload from '../../../analytics.codegen';
import { ANALYTICS_CHANNEL } from '../../../common/constants';

function TrackTabViewed({ activeTab }: { activeTab: number | null }) {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  useLayoutEffect(() => {
    createAnalyticsEvent(createEventPayload('ui.tab.viewed', {})).fire(
      ANALYTICS_CHANNEL,
    );
  }, [activeTab, createAnalyticsEvent]);

  return null;
}

export default TrackTabViewed;
