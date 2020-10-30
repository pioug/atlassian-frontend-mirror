import React from 'react';
import styled from 'styled-components';
import Lozenge from '@atlaskit/lozenge';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize } from '@atlaskit/theme';

export const OuterLozengeContainer = styled.span`
  display: inline-block;
  margin-left: ${gridSize()}px;
`;

export const InnerLozengeContainer = styled.span`
  padding-left: ${gridSize()}px;
  padding-right: ${gridSize()}px;
`;

interface AkLozengeProps {
  children: React.ReactNode;
  isBold?: boolean;
}

export default ({ children, isBold = true, ...props }: AkLozengeProps) => (
  <OuterLozengeContainer>
    <Lozenge appearance="inprogress" isBold={isBold} {...props}>
      <InnerLozengeContainer>{children}</InnerLozengeContainer>
    </Lozenge>
  </OuterLozengeContainer>
);
