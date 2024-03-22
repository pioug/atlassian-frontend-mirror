/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

const styles = css({
  font: token(
    'font.heading.xsmall',
    'normal 600 14px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
  ),
  margin: 0,
});
interface Props {}

export default ({}: Props) => (
  <SuccessContainer>
    <h1 css={styles}>Thanks for signing up</h1>
    <p>
      We may reach out to you in the future to participate in additional
      research.
    </p>
  </SuccessContainer>
);
