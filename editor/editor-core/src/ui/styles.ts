import { HTMLAttributes, ComponentClass } from 'react';
import styled, { css } from 'styled-components';
import { gridSize, borderRadius } from '@atlaskit/theme/constants';
import { N30, N100 } from '@atlaskit/theme/colors';
import {
  akEditorMobileMaxWidth,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';

const akGridSize = gridSize() + 'px';

export const ButtonGroup: ComponentClass<
  HTMLAttributes<{}> & {
    width?: 'small' | 'large';
  }
> = styled.span`
  display: inline-flex;
  align-items: center;

  & > div {
    display: flex;
  }
`;

export const Separator: ComponentClass<HTMLAttributes<{}>> = styled.span`
  background: ${N30};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & {
    isSmall?: boolean;
  }
> = styled.span`
  display: flex;
  align-items: center;

  > div,
  > span {
    display: flex;
  }

  > div > div {
    display: flex;
  }
  margin-left: ${({ isSmall }: { isSmall?: boolean }) => (isSmall ? 4 : 0)}px;
  min-width: ${({ isSmall }: { isSmall?: boolean }) =>
    isSmall ? '40px' : 'auto'};
`;

export const ExpandIconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-left: -8px;
`;

export const TriggerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
`;

export const MenuWrapper: ComponentClass<HTMLAttributes<{}>> = Wrapper;

export const ButtonContent: ComponentClass<
  HTMLAttributes<{}> & {
    spacing: string;
  }
> = styled.span`
  display: flex;
  min-width: 80px;
  align-items: center;
  overflow: hidden;
  justify-content: center;
  flex-direction: column;
  padding: 0 ${(props: any) => (props.spacing === 'none' ? '8px' : '6px')};
`;

// Taken from the style of inline dialog components
export const dropShadow = css`
  box-shadow: 0 0 1px rgba(9, 30, 66, 0.31),
    0 4px 8px -2px rgba(9, 30, 66, 0.25);
`;

export const scrollbarStyles = `
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar {
    height: ${akGridSize};
    width: ${akGridSize};
  }

  &::-webkit-scrollbar-corner {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0);
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: ${akGridSize};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

export const Shortcut = styled.div`
  background-color: rgba(223, 225, 229, 0.5); /* N60 at 50% */
  color: ${N100};
  border-radius: ${borderRadius()}px;
  padding: 4px;
  line-height: 12px;
  font-size: ${relativeFontSizeToBase16(11.67)};
  align-self: flex-end;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    display: none;
  }
`;

export const ClickSelectWrapper: React.ComponentClass<React.HTMLAttributes<{}>> = styled.span`
  user-select: all;
`;

type CellColourPreviewProps = {
  selectedColor: string;
};

export const CellColourPreview = styled.div<CellColourPreviewProps>`
  &::before {
    background: ${(props) => props.selectedColor};
  }
`;
