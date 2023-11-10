import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N800 } from '@atlaskit/theme/colors';

export const content = css`
  & div.toolsDrawer {
    padding: ${token('space.100', '8px')} ${token('space.200', '16px')};
    background: ${token('color.background.neutral.bold', N800)};

    & label {
      display: flex;
      color: ${token('color.text.inverse', 'white')};
      align-self: center;
      padding-right: ${token('space.100', '8px')};
    }

    & > div {
      /* padding: 4px 0; */
    }

    & button {
      margin: ${token('space.050', '4px')} 0;
    }
  }

  & legend {
    margin: ${token('space.100', '8px')} 0;
  }

  & input {
    font-size: 13px;
  }
`;
