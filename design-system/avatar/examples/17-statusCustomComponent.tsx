// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { Block } from '../examples-util/helpers';
import Avatar from '../src';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
const DivPresence = styled.div`
  align-items: center;
  background-color: ${token(
    'color.background.discovery.bold',
    'rebeccapurple',
  )};
  color: ${token('elevation.surface', 'white')};
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
      name="xxlarge"
      size="xxlarge"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      name="xlarge"
      size="xlarge"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      name="large"
      size="large"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      name="medium"
      size="medium"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      name="small"
      size="small"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
    <Avatar
      name="xsmall"
      size="xsmall"
      appearance="square"
      status={<DivPresence>1</DivPresence>}
    />
  </Block>
);
