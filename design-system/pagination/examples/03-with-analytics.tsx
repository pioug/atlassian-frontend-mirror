import React, { useState } from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { Code } from '@atlaskit/code';
import Stack from '@atlaskit/ds-explorations/stack';
import Heading from '@atlaskit/heading';

import Pagination from '../src';

export default function AnalyticsExample() {
  const [analyticEventContext, setAnalyticEventContext] = useState({});
  const [analyticEventPayload, setAnalyticEventPayload] = useState({});

  const sendAnalytics = (analyticEvent: { context: any; payload: any }) => {
    setAnalyticEventContext(analyticEvent.context);
    setAnalyticEventPayload(analyticEvent.payload);
  };

  return (
    <AnalyticsListener channel="atlaskit" onEvent={sendAnalytics}>
      <Stack gap="space.500">
        <Pagination
          testId="pagination"
          getPageLabel={(page: any) =>
            typeof page === 'object' ? page.value : page
          }
          pages={pageLinks}
        />
        <Stack gap="space.150">
          <Heading level="h700">Analytics event context received</Heading>
          <Code>{JSON.stringify(analyticEventContext, null, 2)}</Code>
        </Stack>
        <Stack gap="space.150">
          <Heading level="h700">Analytics event payload received</Heading>
          <Code>{JSON.stringify(analyticEventPayload, null, 2)}</Code>
        </Stack>
      </Stack>
    </AnalyticsListener>
  );
}

const pageLinks: Array<{ value: number }> = [...Array(13)].map((_, index) => ({
  value: index + 1,
}));
