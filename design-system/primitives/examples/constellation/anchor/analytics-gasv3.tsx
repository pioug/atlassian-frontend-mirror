import React, { useCallback } from 'react';

import {
  AnalyticsListener,
  type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Anchor from '@atlaskit/primitives/anchor';
import {
  ANALYTICS_BRIDGE_CHANNEL,
  extractAWCDataFromEvent,
  fireUIAnalytics,
} from '@atlassian/analytics-bridge';

export default function AnalyticsGASv3() {
  const handleEvent = useCallback(
    (event: UIAnalyticsEvent, channel?: string) => {
      console.log(`Channel: '${channel}'`, extractAWCDataFromEvent(event));
    },
    [],
  );

  const handleClick = useCallback(
    (
      _: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ) => {
      fireUIAnalytics(analyticsEvent, 'theActionSubjectId');
    },
    [],
  );

  return (
    <AnalyticsListener channel={ANALYTICS_BRIDGE_CHANNEL} onEvent={handleEvent}>
      <Anchor
        href="/components/primitives/overview"
        target="_blank"
        onClick={handleClick}
        analyticsContext={{
          attributes: {
            color: 'blue',
            someId: 937458,
          },
        }}
      >
        Fire GASv3 compatible event
      </Anchor>
    </AnalyticsListener>
  );
}
