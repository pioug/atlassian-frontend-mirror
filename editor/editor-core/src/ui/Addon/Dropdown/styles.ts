import { css } from '@emotion/react';

import { N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const dropdown = css`
  display: flex;
  flex-direction: column;
  background: ${token('elevation.surface.overlay', 'white')};
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`,
  )};
  box-sizing: border-box;
  padding: ${token('space.050', '4px')} 0;
`;
