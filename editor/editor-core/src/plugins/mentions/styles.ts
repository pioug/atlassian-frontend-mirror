import { css } from '@emotion/react';

import { MentionSharedCssClassName } from '@atlaskit/editor-common/mention';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorDeleteBackgroundWithOpacity,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { N500, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const mentionsStyles = css`
  .${MentionSharedCssClassName.MENTION_CONTAINER} {
    &.${akEditorSelectedNodeClassName} [data-mention-id] > span {
      ${getSelectionStyles([
        SelectionStyle.BoxShadow,
        SelectionStyle.Background,
      ])}

      /* need to specify dark text colour because personal mentions
         (in dark blue) have white text by default */
      color: ${token(
        'color.text.subtle',
        N500,
      )};
    }
  }

  .danger {
    .${MentionSharedCssClassName.MENTION_CONTAINER}.${akEditorSelectedNodeClassName}
      > span
      > span {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
      background-color: ${token(
        'color.background.danger',
        akEditorDeleteBackgroundWithOpacity,
      )};
    }
    .${MentionSharedCssClassName.MENTION_CONTAINER} > span > span {
      background-color: ${token('color.background.neutral', N30A)};
      color: ${token('color.text.subtle', N500)};
    }
  }
`;
