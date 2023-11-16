/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import Spinner from '@atlaskit/spinner';

const spinnerWrapper = css`
  display: flex;
  justify-content: center;
  margin-top: ${token('space.800', '64px')};
`;

const LoadingState = () => (
  <div css={spinnerWrapper} data-testid="ConfigPanelLoading">
    <Spinner size="small" />
  </div>
);

export default LoadingState;
