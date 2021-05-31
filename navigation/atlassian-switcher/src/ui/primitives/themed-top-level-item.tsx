import React from 'react';
import { TopLevelItemWrapperTheme } from '../theme/default-theme';
import { ThemeTokens } from '../theme/types';
import styled from 'styled-components';

interface ToggleProps {
  isParentHovered?: boolean;
  tokens?: Partial<ThemeTokens>;
  children: React.ReactNode;
}

const ThemeableItemParent = styled.div<ToggleProps>`
  ${({ isParentHovered, tokens }) =>
    isParentHovered && `background-color: ${tokens!.hover!.background}`};
  border-radius: 3px;
  flex-grow: 1;
`;

const ThemeableItemWrapper = styled(ThemeableItemParent)<ToggleProps>`
  width: 100%;
  overflow: hidden;
`;

const ThemeableToggleStyle = styled(ThemeableItemParent)<ToggleProps>`
  max-height: 47px;
  cursor: pointer;
  margin-left: 2px;
`;

export const ItemWrapper = (props: ToggleProps) => (
  <TopLevelItemWrapperTheme.Consumer>
    {(tokens) => <ThemeableItemWrapper {...props} tokens={tokens} />}
  </TopLevelItemWrapperTheme.Consumer>
);

export const Toggle = (props: ToggleProps) => (
  <TopLevelItemWrapperTheme.Consumer>
    {(tokens) => <ThemeableToggleStyle {...props} tokens={tokens} />}
  </TopLevelItemWrapperTheme.Consumer>
);
