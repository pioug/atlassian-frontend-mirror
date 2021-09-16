import React from 'react';

import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { N20, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Tooltip from '../src';

import { Target } from './styled';

const direction: { [key: string]: string } = {
  horizontal: 'overflow-x',
  vertical: 'overflow-y',
  nested: 'overflow',
};

interface StyledProps {
  scroll: string;
}

const Parent = styled.div<StyledProps>`
  background-color: ${token('color.background.sunken', N20)};
  border-radius: 5px;
  margin-bottom: 8px;
  height: 64px;
  padding: 8px;
  ${(p) => direction[p.scroll]}: scroll;

  &:last-child {
    margin-bottom: 0;
  }
`;
const Shim = styled.div<StyledProps>`
  display: flex;
  justify-content: space-between;
  ${(p) =>
    p.scroll === 'horizontal' &&
    css`
      width: 200%;
      flex-direction: row;
    `};
  ${(p) =>
    p.scroll === 'vertical' &&
    css`
      height: 200%;
      flex-direction: column;
    `};
`;

export default () => (
  <div>
    <Parent scroll="horizontal">
      <Shim scroll="horizontal">
        <p>
          Horizontal &mdash; scroll <strong>right</strong> to see the target.
        </p>
        <Tooltip content={'Scroll "horizontal"'}>
          {/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */}
          <Target color="green">Horizontal</Target>
        </Tooltip>
      </Shim>
    </Parent>
    <Parent scroll="vertical">
      <Shim scroll="vertical">
        <p>
          Vertical &mdash; scroll <strong>down</strong> to see the target.
        </p>
        <Tooltip content={'Scroll "vertical"'}>
          {/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */}
          <Target color="yellow">Vertical</Target>
        </Tooltip>
      </Shim>
    </Parent>
    <Parent scroll="horizontal">
      <Shim scroll="horizontal">
        <p>
          Nested &mdash; scroll <strong>right</strong> to see the target.
        </p>
        <Parent
          scroll="vertical"
          style={{
            backgroundColor: token('color.background.overlay', N40),
          }}
        >
          <Shim scroll="vertical">
            <p>
              Scroll <strong>down</strong> to see the target.
            </p>
            <Tooltip content={'Scroll "nested"'}>
              {/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */}
              <Target color="red">Nested</Target>
            </Tooltip>
          </Shim>
        </Parent>
      </Shim>
    </Parent>
  </div>
);
