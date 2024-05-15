import React, { useCallback } from 'react';

import {
  AnalyticsListener,
  type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { Inline } from '@atlaskit/primitives';
import Anchor from '@atlaskit/primitives/anchor';

export default function Analytics() {
  const handleEvent = useCallback(
    (event: UIAnalyticsEvent, channel?: string) => {
      console.log(`Channel: '${channel}'`, event);
    },
    [],
  );

  return (
    <AnalyticsListener channel="*" onEvent={handleEvent}>
      <Inline space="space.100">
        <Anchor href="/components/primitives/overview" target="_blank">
          Default
        </Anchor>
        <Anchor
          href="/components/primitives/overview"
          target="_blank"
          onClick={(_, analyticsEvent) => {
            analyticsEvent.fire('my-channel');
          }}
        >
          Fires on "my-channel"
        </Anchor>
        <Anchor
          href="/components/primitives/overview"
          target="_blank"
          componentName="MyButton"
          analyticsContext={{
            color: 'blue',
            someId: 937458,
          }}
        >
          Customized event data
        </Anchor>
      </Inline>
    </AnalyticsListener>
  );
}
