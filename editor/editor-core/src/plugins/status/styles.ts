import { css } from 'styled-components';
import {
  StatusSharedCssClassName,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorDeleteBackgroundWithOpacity,
} from '@atlaskit/editor-common';
import { akEditorSelectedNodeClassName } from '../../styles';
import { getSelectionStyles } from '../selection/utils';
import { SelectionStyle } from '../selection/types';

export const statusStyles = css`
  .${StatusSharedCssClassName.STATUS_CONTAINER} {
    > span {
      display: inline-block;
      cursor: pointer;
      line-height: 0; /* Prevent responsive layouts increasing height of container. */
    }

    &.${akEditorSelectedNodeClassName}
      .${StatusSharedCssClassName.STATUS_LOZENGE}
      > span {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }
  }

  .danger {
    .${StatusSharedCssClassName.STATUS_LOZENGE} > span {
      background-color: ${akEditorDeleteBackgroundWithOpacity};
    }

    .${StatusSharedCssClassName.STATUS_CONTAINER}.${akEditorSelectedNodeClassName}
      .${StatusSharedCssClassName.STATUS_LOZENGE}
      > span {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
    }
  }
`;
