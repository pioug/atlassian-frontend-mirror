// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { Block } from '../examples-util/helpers';
import Avatar from '../src';

const DivPresence = styled.div`
  align-items: center;
  background-color: ${token(
    'color.background.boldDiscovery.resting',
    'rebeccapurple',
  )};
  color: ${token('color.background.default', 'white')};
  display: flex;
  font-size: 0.75em;
  font-weight: 500;
  height: 100%;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

export default () => (
  <Block heading="Custom div as status">
    <Avatar
      size="xxlarge"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      size="xlarge"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      size="large"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      size="medium"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      size="small"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      size="xsmall"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
  </Block>
);
