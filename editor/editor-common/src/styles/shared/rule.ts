import { css } from '@emotion/react';

import { akEditorLineHeight } from '@atlaskit/editor-shared-styles';
import { DN50, N30A } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const divider = themed({
  light: token('color.border', N30A),
  dark: token('color.border', DN50),
});

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const ruleSharedStyles = (props: ThemeProps) => css`
  & hr {
    border: none;
    background-color: ${divider(props)};
    margin: ${akEditorLineHeight}em 0;
    height: 2px;
    border-radius: 1px;
  }
`;
