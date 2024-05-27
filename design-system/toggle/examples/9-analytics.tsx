import React from 'react';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives';

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
      <Stack>
        <Label htmlFor="toggle">Large toggle</Label>
        <Toggle
          id="toggle"
          size="large"
          defaultChecked
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={onChange}
        />
      </Stack>
    </AnalyticsListener>
  );
};
