import React from 'react';

import styled from 'styled-components';

import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { token } from '@atlaskit/tokens';

const message =
  'Restrictions on this page may prevent people from viewing or editing';

const Wrapper = styled.div`
  max-width: 100%;
  color: ${token('color.text.danger', '#de350c')};
  display: flex;

  & > div {
    flex-grow: 1;
    line-height: 24px;
  }
`;

export default () => (
  <Wrapper>
    <LockFilledIcon label={message} /> <div>{message}</div>
  </Wrapper>
);
