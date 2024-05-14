import React, { useCallback } from 'react';

import {
  AnalyticsListener,
  type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { ButtonGroup } from '@atlaskit/button';
import Pressable from '@atlaskit/primitives/pressable';

export default function Analytics() {
  const handleEvent = useCallback(
    (event: UIAnalyticsEvent, channel?: string) => {
      console.log(`Channel: '${channel}'`, event);
    },
    [],
  );

  return (
    <AnalyticsListener channel="*" onEvent={handleEvent}>
      <ButtonGroup label="Pressable buttons with analytics">
        <Pressable>Default</Pressable>
        <Pressable
          onClick={(_, analyticsEvent) => {
            analyticsEvent.fire('my-channel');
          }}
        >
          Fires on "my-channel"
        </Pressable>
        <Pressable
          componentName="MyButton"
          analyticsContext={{
            color: 'blue',
            someId: 937458,
          }}
        >
          Customized event data
        </Pressable>
      </ButtonGroup>
    </AnalyticsListener>
  );
}
