import { css } from '@emotion/react';

import { akEditorLineHeight } from '@atlaskit/editor-shared-styles';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const ruleSharedStyles = () => css`
  & hr {
    border: none;
    background-color: ${token('color.border', N30A)};
    margin: ${akEditorLineHeight}em 0;
    height: 2px;
    border-radius: 1px;
  }
`;
