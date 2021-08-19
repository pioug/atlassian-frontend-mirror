/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import TextArea from '../src';

const noop = () => {};
const sendAnalytics = (analytic: UIAnalyticsEvent) =>
  console.log('analytic: ', analytic.payload);
const wrapperStyles = css({
  maxWidth: 500,
});

export default () => {
  return (
    <div id="analytics" css={wrapperStyles}>
      <p>Log onFocus & onBlur analytics</p>
      <AnalyticsListener onEvent={sendAnalytics} channel="atlaskit">
        <TextArea
          placeholder="Type here..."
          testId="analyticsTextArea"
          onBlur={noop}
          onFocus={noop}
        />
      </AnalyticsListener>
    </div>
  );
};
