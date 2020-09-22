import { css } from 'styled-components';

import {
  akEditorLineHeight,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const paragraphSharedStyles = css`
  & p {
    font-size: 1em;
    line-height: ${akEditorLineHeight};
    font-weight: normal;
    margin-top: ${blockNodesVerticalMargin};
    margin-bottom: 0;
    letter-spacing: -0.005em;
  }
`;
