import { css } from 'styled-components';

import { N30A } from '@atlaskit/theme/colors';

import { akEditorLineHeight } from '../consts';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const ruleSharedStyles = css`
  & hr {
    border: none;
    background-color: ${N30A};
    margin: ${akEditorLineHeight}em 0;
    height: 2px;
    border-radius: 1px;
  }
`;
