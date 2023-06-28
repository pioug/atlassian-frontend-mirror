/** @jsx jsx */
import { useLayoutEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import createEventPayload from '../../../common/utils/analytics/analytics.codegen';
import { ANALYTICS_CHANNEL } from '../../../common/constants';
import { LinkPickerPlugin } from '../../../index';

export function TrackTabViewed({
  activePlugin,
}: {
  activePlugin: LinkPickerPlugin | undefined;
}) {
  const { createAnalyticsEvent } = useAnalyticsEvents();

  useLayoutEffect(() => {
    if (activePlugin) {
      createAnalyticsEvent(createEventPayload('ui.tab.viewed', {})).fire(
        ANALYTICS_CHANNEL,
      );
    }
  }, [activePlugin, createAnalyticsEvent]);

  return null;
}
