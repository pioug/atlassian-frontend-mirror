import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

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
  background-color: ${token('elevation.surface.sunken')};
  border-radius: 5px;
  margin-bottom: ${token('space.100', '8px')};
  height: 64px;
  padding: ${token('space.100', '8px')};
  ${(p) => direction[p.scroll]}: scroll;

  &:last-child {
    margin-bottom: ${token('space.0', '0px')};
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
          {(tooltipProps) => (
            <Target color="green" {...tooltipProps}>
              Horizontal
            </Target>
          )}
        </Tooltip>
      </Shim>
    </Parent>
    <Parent scroll="vertical">
      <Shim scroll="vertical">
        <p>
          Vertical &mdash; scroll <strong>down</strong> to see the target.
        </p>
        <Tooltip content={'Scroll "vertical"'}>
          {(tooltipProps) => (
            <Target color="yellow" {...tooltipProps}>
              Vertical
            </Target>
          )}
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
            backgroundColor: token('elevation.surface.overlay'),
          }}
        >
          <Shim scroll="vertical">
            <p>
              Scroll <strong>down</strong> to see the target.
            </p>
            <Tooltip content={'Scroll "nested"'}>
              {(tooltipProps) => (
                <Target color="red" {...tooltipProps}>
                  Nested
                </Target>
              )}
            </Tooltip>
          </Shim>
        </Parent>
      </Shim>
    </Parent>
  </div>
);
