/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css } from '@emotion/react';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

export const content = css`
  & div.toolsDrawer {
    margin-top: 16px;
    padding: 8px 16px;
    background: ${N800};

    & label {
      display: flex;
      color: white;
      align-self: center;
      padding-right: 8px;
    }

    & button {
      margin: 4px 0;
    }
  }

  & legend {
    margin: 8px 0;
  }

  & input {
    font-size: ${relativeFontSizeToBase16(13)};
  }
`;

export const buttonGroup = css`
  display: flex;

  & > button {
    margin-left: ${token('space.050', '4px')};
  }
`;
