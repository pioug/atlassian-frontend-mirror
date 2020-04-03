import { css } from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import {
  akEditorBlockquoteBorderColor,
  blockNodesVerticalMargin,
} from '../consts';

export const blockquoteSharedStyles = css`
  & blockquote {
    box-sizing: border-box;
    padding-left: ${gridSize() * 2}px;
    border-left: 2px solid ${akEditorBlockquoteBorderColor};
    margin: ${blockNodesVerticalMargin} 0 0 0;
    margin-right: 0;

    [dir='rtl'] & {
      padding-left: 0;
      padding-right: ${gridSize() * 2}px;
    }

    &:first-child {
      margin-top: 0;
    }

    &::before {
      content: '';
    }

    &::after {
      content: none;
    }

    & p {
      display: block;
    }

    & table,
    & table:last-child {
      display: inline-table;
    }
  }
`;
