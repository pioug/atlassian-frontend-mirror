import React from 'react';

import styled from 'styled-components';

import { B400, B500, N0, N20 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';

import Badge from '../src';

interface ItemProps {
  inverted?: boolean;
}

const Item = styled.div<ItemProps>`
  align-items: center;
  background: ${(props) => (props.inverted ? B400 : 'none')};
  border-radius: ${borderRadius}px;
  color: ${(props) => (props.inverted ? N0 : 'inherit')};
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  max-width: 300px;
  padding: 0.6em 1em;

  &:hover {
    background-color: ${(props) => (props.inverted ? B500 : N20)};
  }
`;

export default function Example() {
  return (
    <div>
      <Item>
        <p>Added</p>
        <Badge appearance="added" max={99} testId="badge">
          {3000}
        </Badge>
      </Item>
      <Item>
        <p>Default</p>
        <Badge testId="badge-default">{5}</Badge>
      </Item>
      <Item>
        <p>Default (∞)</p>
        <Badge max={Infinity} testId="badge">
          {Infinity}
        </Badge>
      </Item>
      <Item>
        <p>Important</p>
        <Badge appearance="important" testId="badge">
          {25}
        </Badge>
      </Item>
      <Item>
        <p>Primary</p>
        <Badge appearance="primary" testId="badge">
          {-5}
        </Badge>
      </Item>
      <Item inverted>
        <p>Primary Inverted</p>
        <Badge appearance="primaryInverted" testId="badge">
          {5}
        </Badge>
      </Item>
      <Item>
        <p>Removed</p>
        <Badge appearance="removed" testId="badge">
          {100}
        </Badge>
      </Item>
      <Item>
        <p>Added code</p>
        <Badge appearance="added" testId="badge">
          +100
        </Badge>
      </Item>
      <Item>
        <p>Removed code</p>
        <Badge appearance="removed" testId="badge">
          -100
        </Badge>
      </Item>
      <Item>
        <p>Added</p>
        <Badge appearance="added" max={4000} testId="badge">
          {3000}
        </Badge>
      </Item>
    </div>
  );
}
