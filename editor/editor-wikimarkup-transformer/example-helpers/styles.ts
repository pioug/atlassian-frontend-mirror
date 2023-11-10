import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
// @ts-ignore: unused variable
// prettier-ignore
import { N800 } from '@atlaskit/theme/colors';
export const content = css`
  & div.toolsDrawer {
    padding: 8px 16px;
    background: ${token('color.background.neutral.bold', N800)};

    & label {
      display: flex;
      color: ${token('color.text.inverse', 'white')};
      align-self: center;
      padding-right: 8px;
    }

    & > div {
      /* padding: 4px 0; */
    }

    & button {
      margin: 4px 0;
    }
  }

  & legend {
    margin: 8px 0;
  }

  & input {
    font-size: 13px;
  }
`;
