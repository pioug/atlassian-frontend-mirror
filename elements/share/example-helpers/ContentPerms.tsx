import React from 'react';

import styled from 'styled-components';

import UnlockIcon from '@atlaskit/icon/glyph/unlock';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const message = 'Anyone can view';

const Wrapper = styled.div`
  max-width: 100%;
  line-height: 40px;
  color: ${token('color.text.subtle', N300)};
`;

const CopyWrapper = styled.span`
  position: relative;
  bottom: 5px;
`;

export default () => (
  <Wrapper>
    <CopyWrapper>{message}</CopyWrapper>
    <UnlockIcon size="medium" label={message} />
  </Wrapper>
);
