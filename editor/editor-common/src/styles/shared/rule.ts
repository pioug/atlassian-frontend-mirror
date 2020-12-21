import { css } from 'styled-components';

import { akEditorLineHeight } from '@atlaskit/editor-shared-styles';
import { DN50, N30A } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

const divider = themed({ light: N30A, dark: DN50 });

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const ruleSharedStyles = css`
  & hr {
    border: none;
    background-color: ${divider};
    margin: ${akEditorLineHeight}em 0;
    height: 2px;
    border-radius: 1px;
  }
`;
