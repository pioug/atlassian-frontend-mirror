import { css } from '@emotion/react';

import { ThemeProps } from '@atlaskit/theme/types';
import { h100, h300, h400, h500, h600, h700 } from '@atlaskit/theme/typography';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
// text sizing prototype: http://proto/fabricrender/
export const headingsSharedStyles = (props: ThemeProps) => css`
  & h1 {
    ${h700(props)};
    margin-bottom: 0;
    margin-top: 1.667em;
  }

  & h2 {
    ${h600(props)};
    margin-top: 1.8em;
    margin-bottom: 0;
  }

  & h3 {
    ${h500(props)};
    margin-top: 2em;
    margin-bottom: 0;
  }

  & h4 {
    ${h400(props)};
    margin-top: 1.357em;
  }

  & h5 {
    ${h300(props)};
    margin-top: 1.667em;
    text-transform: none;
  }

  & h6 {
    ${h100(props)};
    margin-top: 1.455em;
    text-transform: none;
  }
`;
