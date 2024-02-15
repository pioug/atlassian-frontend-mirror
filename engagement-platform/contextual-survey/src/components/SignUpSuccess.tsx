/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import SuccessContainer from './SuccessContainer';

interface Props {}

export default ({}: Props) => (
  <SuccessContainer>
    <h1
      css={css`
        font-size: ${fontSize()}px;
        font-weight: 600;
        line-height: ${token('font.lineHeight.300', '24px')};
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
