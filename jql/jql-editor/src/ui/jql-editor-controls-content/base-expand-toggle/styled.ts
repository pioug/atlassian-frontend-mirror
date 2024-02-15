import styled from '@emotion/styled';

import { N40, N50 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ExpandToggleContainer = styled.div`
  /* Override background styles for our button to match designs */

  > button {
    border-radius: 100%;
    /* Fill the remaining vertical space for a single line in our editor and space between buttons */
    margin: ${token('space.050', '4px')} 0;

    &:hover {
      background: ${token('color.background.neutral.subtle.hovered', N40)};
    }

    &:active,
    &[data-firefox-is-active='true'] {
      background: ${token('color.background.neutral.subtle.pressed', N50)};
    }
  }
`;
