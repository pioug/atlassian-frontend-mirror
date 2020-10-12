/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { fontSize, gridSize } from '@atlaskit/theme/constants';

import SuccessContainer from './SuccessContainer';

export default () => (
  <SuccessContainer>
    <h1
      css={css`
        font-size: ${fontSize()}px;
        font-weight: 600;
        margin-top: 0;
        line-height: ${gridSize() * 3}px;
      `}
    >
      Thanks for your feedback
    </h1>
  </SuccessContainer>
);
