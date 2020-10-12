/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { fontSize, gridSize } from '@atlaskit/theme/constants';

import SuccessContainer from './SuccessContainer';

interface Props {}

export default ({}: Props) => (
  <SuccessContainer>
    <h1
      css={css`
        font-size: ${fontSize()}px;
        font-weight: 600;
        line-height: ${gridSize() * 3}px;
        margin: 0;
      `}
    >
      Thanks for signing up
    </h1>
    <p>
      We may reach out to you in the future to participate in additional
      research.
    </p>
  </SuccessContainer>
);
