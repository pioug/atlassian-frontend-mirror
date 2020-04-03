import React from 'react';
import styled from 'styled-components';
import Avatar from '../src';
import { Block } from '../examples-util/helpers';

const DivPresence = styled.div`
  align-items: center;
  background-color: rebeccapurple;
  color: white;
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
