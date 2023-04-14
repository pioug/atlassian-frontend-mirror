/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

export default () => (
  <SuccessContainer>
    <h1
      css={css`
        font-size: ${fontSize()}px;
        font-weight: 600;
        margin-top: 0;
        line-height: ${token('font.lineHeight.300', '24px')};
      `}
    >
      Thanks for your feedback
    </h1>
  </SuccessContainer>
);
