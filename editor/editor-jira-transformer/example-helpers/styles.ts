/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css } from '@emotion/react';
import { N800 } from '@atlaskit/theme/colors';

export const content = css`
  & div.toolsDrawer {
    padding: 8px 16px;
    background: ${N800};

    & label {
      display: flex;
      color: white;
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
