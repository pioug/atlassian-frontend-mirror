/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

const styles = css({
  font: token(
    'font.heading.xsmall',
    'normal 600 14px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  marginTop: 0,
});
export default () => (
  <SuccessContainer>
    <h1 css={styles}>Thanks for your feedback</h1>
  </SuccessContainer>
);
