import styled from 'styled-components';
import { token } from '@atlaskit/tokens';
import { css } from '@emotion/core';
import { N500, N0, B50, N300, N800, N20, B400 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { relativeFontSizeToBase16 } from './utils';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { fontSizeSmall, fontSize, typography } from '@atlaskit/theme';

const LINK_PICKER_WIDTH_IN_PX = 342;

export const recentListStyles = css`
  width: ${LINK_PICKER_WIDTH_IN_PX}px;
  background: ${token('elevation.surface.overlay', N0)};
`;

export const Container = styled.div`
  padding: ${gridSize() * 2}px;
  width: 100%;
  overflow: hidden;
  line-height: initial;
  box-sizing: border-box;
`;

export const ClearText = styled.button`
  padding: 0;
  margin-right: ${gridSize() / 2}px;
  color: ${token('color.icon.subtle', N500)};
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const FieldWrapper = styled.div`
  margin-bottom: ${gridSize() * 2}px;
`;

export const SearchIconWrapper = styled.span`
  margin-left: ${gridSize() / 2}px;
  color: ${token('color.icon', N500)};
  cursor: default;
`;

export const ListTitleStyles = css`
  ${typography.h100()}
  text-transform: uppercase;
  margin-bottom: ${gridSize() / 2}px;
`;
interface ListItemProps {
  active: boolean;
  selected: boolean;
}

export const ListItemWrapper = styled.li`
  display: flex;
  padding: ${gridSize()}px ${gridSize() * 2}px;
  margin: 0 -${gridSize() * 2}px;
  cursor: pointer;
  background-color: ${(props: ListItemProps) => {
    switch (true) {
      case props.selected:
        return token('color.background.selected', B50);
      case props.active:
        return token('color.background.neutral.subtle.hovered', N20);
      default:
        return 'transparent';
    }
  }};
  box-shadow: inset 2px 0px 0px
    ${(props: ListItemProps) => {
      switch (true) {
        case props.active:
        case props.selected:
          return token('color.border.selected', B400);
        default:
          return 'transparent';
      }
    }};
`;

export const ItemNameWrapper = styled.span`
  overflow: hidden;
`;

export const ListItemName = styled.div`
  color: ${token('color.text', N800)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
`;

export const ListItemContext = styled.div`
  color: ${token('color.text', N300)};
  font-size: ${relativeFontSizeToBase16(fontSizeSmall())};
  line-height: ${fontSize()}px;
`;

export const ItemIconWrapper = styled.span`
  min-width: ${gridSize() * 2}px;
  margin-top: 3px;
  margin-right: 12px;
`;

export const ImgStyles = css`
  max-width: ${gridSize() * 2}px;
`;
