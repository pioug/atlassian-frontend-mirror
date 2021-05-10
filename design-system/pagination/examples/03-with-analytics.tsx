import React, { useState } from 'react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

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
      <Pagination
        testId="pagination"
        getPageLabel={(page: any) =>
          typeof page === 'object' ? page.value : page
        }
        pages={pageLinks}
      />
      <h2>Analytics event context received</h2>
      <pre>{JSON.stringify(analyticEventContext, null, 2)}</pre>
      <h2>Analytics event payload received</h2>
      <pre>{JSON.stringify(analyticEventPayload, null, 2)}</pre>
    </AnalyticsListener>
  );
}

const pageLinks: Array<{ value: number }> = [...Array(13)].map((_, index) => ({
  value: index + 1,
}));
