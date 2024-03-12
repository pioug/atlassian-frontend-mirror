import { css } from '@emotion/react';

import {
  akEditorBlockquoteBorderColor,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const blockquoteSharedStyles = css({
  '& blockquote': {
    boxSizing: 'border-box',
    paddingLeft: token('space.200', '16px'),
    borderLeft: `2px solid ${token(
      'color.border',
      akEditorBlockquoteBorderColor,
    )}`,
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
    margin: `${blockNodesVerticalMargin} 0 0 0`,
    marginRight: 0,
    "[dir='rtl'] &": {
      paddingLeft: 0,
      paddingRight: token('space.200', '16px'),
    },
    '&:first-child': {
      marginTop: 0,
    },
    '&::before': {
      content: "''",
    },
    '&::after': {
      content: 'none',
    },
    '& p': {
      display: 'block',
    },
    '& table, & table:last-child': {
      display: 'inline-table',
    },
  },
});
