/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';

const spinnerWrapper = css`
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;

const LoadingState = () => (
  <div css={spinnerWrapper}>
    <Spinner size="small" />
  </div>
);

export default LoadingState;
