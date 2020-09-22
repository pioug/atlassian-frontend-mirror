import { css } from 'styled-components';

import { MentionSharedCssClassName } from '@atlaskit/editor-common';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorDeleteBackgroundWithOpacity,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { N500, N30A } from '@atlaskit/theme/colors';

export const mentionsStyles = css`
  .${MentionSharedCssClassName.MENTION_CONTAINER} {
    &.${akEditorSelectedNodeClassName} [data-mention-id] > span {
      ${getSelectionStyles([
        SelectionStyle.BoxShadow,
        SelectionStyle.Background,
      ])}

      /* need to specify dark text colour because personal mentions
         (in dark blue) have white text by default */
      color: ${N500};
    }
  }

  .danger {
    .${MentionSharedCssClassName.MENTION_CONTAINER}.${akEditorSelectedNodeClassName}
      > span
      > span {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
      background-color: ${akEditorDeleteBackgroundWithOpacity};
    }
    .${MentionSharedCssClassName.MENTION_CONTAINER} > span > span {
      background-color: ${N30A};
      color: ${N500};
    }
  }
`;
