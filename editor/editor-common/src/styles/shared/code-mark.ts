import { css, Interpolation } from 'styled-components';

import { getCodeStyles } from '@atlaskit/code/inline';
import { DN70, N30A } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

export const codeMarkSharedStyles = css`
  .code {
    --ds--code--bg-color: ${themed({
      light: N30A,
      dark: DN70,
    })};
    ${getCodeStyles as Interpolation<any>}
  }
`;
