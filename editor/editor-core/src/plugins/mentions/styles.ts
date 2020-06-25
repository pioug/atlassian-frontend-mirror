import { css } from 'styled-components';
import {
  MentionSharedCssClassName,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorDeleteBackgroundWithOpacity,
} from '@atlaskit/editor-common';
import { akEditorSelectedNodeClassName } from '../../styles';
import { getSelectionStyles } from '../selection/utils';
import { SelectionStyle } from '../selection/types';
import { colors } from '@atlaskit/theme';

export const mentionsStyles = css`
  .${MentionSharedCssClassName.MENTION_CONTAINER} {
    &.${akEditorSelectedNodeClassName} [data-mention-id] > span {
      ${getSelectionStyles([
        SelectionStyle.BoxShadow,
        SelectionStyle.Background,
      ])}

      /* need to specify dark text colour because personal mentions
         (in dark blue) have white text by default */
      color: ${colors.N500};
    }
  }

  .danger {
    .${
      MentionSharedCssClassName.MENTION_CONTAINER
    }.${akEditorSelectedNodeClassName}
      > span
      > span {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
      background-color: ${akEditorDeleteBackgroundWithOpacity};
    }
    .${MentionSharedCssClassName.MENTION_CONTAINER} > span > span {
      background-color: ${colors.N30A};
      color: ${colors.N500};
    }
  }
`;
