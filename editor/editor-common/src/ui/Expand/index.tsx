import { defineMessages } from 'react-intl';
import styled, { css } from 'styled-components';

import {
  akEditorLineHeight,
  akEditorSwoopCubicBezier,
  akLayoutGutterOffset,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { fontSize, gridSize } from '@atlaskit/theme/constants';

export const messages = defineMessages({
  collapseNode: {
    id: 'fabric.editor.collapseNode',
    defaultMessage: 'Collapse content',
    description: 'Collapse the node',
  },
  expandDefaultTitle: {
    id: 'fabric.editor.expandDefaultTitle',
    defaultMessage: 'Click here to expand...',
    description: 'Placeholder text for an expand node',
  },
  expandNode: {
    id: 'fabric.editor.expandNode',
    defaultMessage: 'Expand content',
    description: 'Expand the node',
  },
  expandPlaceholderText: {
    id: 'fabric.editor.expandPlaceholder',
    defaultMessage: 'Give this expand a title...',
    description: 'Placeholder text for an expand node title input field',
  },
});

const BORDER_RADIUS = gridSize() / 2;

const EXPAND_COLLAPSED_BACKGROUND = 'transparent';
const EXPAND_SELECTED_BACKGROUND = themed({
  light: 'rgba(255, 255, 255, 0.6)',
  dark: 'rgba(9, 10, 11, 0.29)',
});

const EXPAND_FOCUSED_BORDER_COLOR = colors.B300;
const EXPAND_COLLAPSED_BORDER_COLOR = 'transparent';
const EXPAND_EXPANDED_BORDER_COLOR = themed({
  light: colors.N40A,
  dark: colors.DN50,
});

export interface StyleProps {
  expanded?: boolean;
  focused?: boolean;
  'data-node-type'?: 'expand' | 'nestedExpand';
  'data-title'?: string;
}

export const ExpandIconWrapper = styled.div<{ expanded: boolean }>`
  cursor: pointer;
  display: flex;
  color: ${themed({ light: colors.N90, dark: '#d9dde3' })};
  border-radius: ${gridSize() / 2}px;
  width: 24px;
  height: 24px;

  &:hover {
    background: ${colors.N30A};
  }

  svg {
    ${(props) => (props.expanded ? 'transform: rotate(90deg);' : '')}
    transition: transform 0.2s ${akEditorSwoopCubicBezier};
  }
`;

export const ExpandLayoutWrapper = styled.div`
  width: ${gridSize() * 3}px;
  height: ${gridSize() * 3}px;
`;

const ContainerStyles = css<StyleProps>`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ expanded, focused }) => {
    const expandedBorderColor = expanded
      ? EXPAND_EXPANDED_BORDER_COLOR
      : EXPAND_COLLAPSED_BORDER_COLOR;
    return focused ? EXPAND_FOCUSED_BORDER_COLOR : expandedBorderColor;
  }};
  border-radius: ${BORDER_RADIUS}px;
  min-height: 25px;
  background: ${({ expanded }) =>
    !expanded ? EXPAND_COLLAPSED_BACKGROUND : EXPAND_SELECTED_BACKGROUND};
  margin: ${(props) =>
    `${gridSize() / 2 / fontSize()}rem ${
      // Only only these margins if the expand isn't editable
      // and is the root level expand.
      props['data-node-type'] === 'expand' ? `-${akLayoutGutterOffset}px` : `0`
    } 0`};

  transition: background 0.3s ${akEditorSwoopCubicBezier},
    border-color 0.3s ${akEditorSwoopCubicBezier};
  padding: ${gridSize}px;

  &:hover {
    border: 1px solid ${themed({ light: colors.N50A, dark: colors.DN50 })};
    background: ${EXPAND_SELECTED_BACKGROUND};
  }

  td > &:first-child {
    margin-top: 0;
  }
`;

const ContentStyles = css<StyleProps>`
  ${({ expanded }) => {
    return css`
      padding-top: ${expanded ? gridSize() : 0}px;
      padding-right: ${gridSize()}px;
      padding-left: ${gridSize() * 4 - gridSize() / 2}px;
      display: table;
      display: flow-root;

      // The follow rules inside @supports block are added as a part of ED-8893
      // The fix is targeting mobile bridge on iOS 12 or below,
      // We should consider remove this fix when we no longer support iOS 12
      @supports not (display: flow-root) {
        width: 100%;
        box-sizing: border-box;
      }

      ${!expanded
        ? `
        .expand-content-wrapper, .nestedExpand-content-wrapper {
          /* We visually hide the content here to preserve the content during copy+paste */
          width: 100%;
          display: block;
          height: 0;
          overflow: hidden;
          clip: rect(1px, 1px, 1px, 1px);
          white-space: nowrap;
          user-select: none;
        }
      `
        : ''}
    `;
  }};
`;

const TitleInputStyles = css`
  outline: none;
  border: none;
  font-size: ${relativeFontSizeToBase16(fontSize())};
  line-height: ${akEditorLineHeight};
  font-weight: normal;
  color: ${themed({ light: colors.N200A, dark: colors.DN600 })};
  background: transparent;
  display: flex;
  flex: 1;
  padding: 0 0 0 ${gridSize() / 2}px;
  width: 100%;

  &::placeholder {
    opacity: 0.6;
    color: ${themed({ light: colors.N200A, dark: colors.DN600 })};
  }
`;

const TitleContainerStyles = css`
  padding: 0;
  display: flex;
  align-items: flex-start;
  background: none;
  border: none;
  font-size: ${relativeFontSizeToBase16(fontSize())};
  width: 100%;
  color: ${themed({ light: colors.N300A, dark: colors.DN600 })};
  overflow: hidden;
  cursor: pointer;
  // Prevent browser selection being inside the title container
  user-select: none;

  &:focus {
    outline: 0;
  }
`;

export const sharedExpandStyles = {
  TitleInputStyles,
  TitleContainerStyles,
  ContainerStyles,
  ContentStyles,
};
