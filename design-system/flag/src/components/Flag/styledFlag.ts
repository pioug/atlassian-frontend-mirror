import styled from 'styled-components';

import { AtlaskitThemeProps } from '@atlaskit/theme';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

import {
  flagBackgroundColor,
  flagBorderColor,
  flagTextColor,
  flagShadowColor,
  flagFocusRingColor,
} from '../../theme';

import { AppearanceTypes } from '../../types';

interface FlagColorProps extends AtlaskitThemeProps {
  appearance?: AppearanceTypes;
}
const getBoxShadow = (props: FlagColorProps) => {
  const borderColor = flagBorderColor(props);
  const shadowColor = flagShadowColor(props);

  const border = borderColor && `0 0 1px ${borderColor}`;
  const shadow = `0 20px 32px -8px ${shadowColor}`;

  return [border, shadow].filter(p => p).join(',');
};

export default styled.div<{ appearance?: AppearanceTypes }>`
  background-color: ${flagBackgroundColor};
  border-radius: ${borderRadius}px;
  box-sizing: border-box;
  box-shadow: ${getBoxShadow};
  color: ${flagTextColor};
  padding: ${multiply(gridSize, 2)}px;
  transition: background-color 200ms;
  width: 100%;
  z-index: 600;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${flagFocusRingColor};
  }
`;

// Header
export const Header = styled.div`
  display: flex;
  align-items: center;
  height: ${multiply(gridSize, 4)}px;
`;

export const Icon = styled.div`
  flex: 0 0 auto;
  width: ${multiply(gridSize, 5)}px;
  height: ${gridSize() * 3}px;
`;

export const Title = styled.span<{ appearance?: AppearanceTypes }>`
  color: ${flagTextColor};
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface DismissButtonProps {
  appearance?: AppearanceTypes;
  focusRingColor: string;
}

export const DismissButton = styled.button<DismissButtonProps>`
  appearance: none;
  background: none;
  border: none;
  border-radius: ${borderRadius}px;
  color: ${flagTextColor};
  cursor: pointer;
  flex: 0 0 auto;
  line-height: 1;
  margin-left: ${gridSize}px;
  padding: 0;
  white-space: nowrap;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${flagFocusRingColor};
  }
`;

// Content
export const Content = styled.div`
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 0 0 0 ${multiply(gridSize, 5)}px;
`;

interface ExpanderProps {
  isExpanded: boolean;
}
export const Expander = styled.div<ExpanderProps>`
  max-height: ${({ isExpanded }) => (isExpanded ? 150 : 0)}px;
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
  overflow: ${({ isExpanded }) => (isExpanded ? 'visible' : 'hidden')};
  transition: max-height 0.3s, opacity 0.3s;
`;

export const Description = styled.div<{ appearance?: AppearanceTypes }>`
  color: ${flagTextColor};
  word-wrap: break-word;
`;
