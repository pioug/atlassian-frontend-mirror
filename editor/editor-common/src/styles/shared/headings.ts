import { css } from 'styled-components';
import { typography } from '@atlaskit/theme';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/
export const headingsSharedStyles = css`
  & h1 {
    ${typography.h700};
    margin-bottom: 0;
    margin-top: 1.667em;
  }

  & h2 {
    ${typography.h600};
    margin-top: 1.8em;
    margin-bottom: 0;
  }

  & h3 {
    ${typography.h500};
    margin-top: 2em;
    margin-bottom: 0;
  }

  & h4 {
    ${typography.h400};
    margin-top: 1.357em;
  }

  & h5 {
    ${typography.h300};
    margin-top: 1.667em;
    text-transform: none;
  }

  & h6 {
    ${typography.h100};
    margin-top: 1.455em;
    text-transform: none;
  }
`;
