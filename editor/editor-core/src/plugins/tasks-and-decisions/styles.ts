import { css } from 'styled-components';
import { akEditorSelectedNodeClassName } from '../../styles';
import { SelectionStyle } from '../selection/types';
import { getSelectionStyles } from '../selection/utils';
import {
  TaskDecisionSharedCssClassName,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorDeleteBackgroundWithOpacity,
} from '@atlaskit/editor-common';

export const taskDecisionStyles = css`
  .${akEditorSelectedNodeClassName} > [data-decision-wrapper] {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }

  .danger {
    .${TaskDecisionSharedCssClassName.DECISION_CONTAINER}.${akEditorSelectedNodeClassName}
      > div {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
      background-color: ${akEditorDeleteBackgroundWithOpacity};
      &::after {
        content: none; /* reset the Blanket selection style */
      }
    }
  }
`;
