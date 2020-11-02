import React from 'react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Toggle from '../src';

const sendAnalytics = (analytic: UIAnalyticsEvent) =>
  console.log('analytic: ', analytic.payload);

export default () => {
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) =>
    console.log(event);
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    console.log(event);
  const onChange = (event: React.ChangeEvent) => console.log(event);

  return (
    <AnalyticsListener channel="atlaskit" onEvent={sendAnalytics}>
      <Toggle
        size="large"
        defaultChecked
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
      />
    </AnalyticsListener>
  );
};
