import styled from '@emotion/styled';

import { N50, N500, N600, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const SyntaxHelpContainer = styled.div`
  /* Override background styles for our button to match designs */

  > a {
    background: ${token('color.background.neutral.bold', N70)};
    border-radius: 100%;
    /* Fill the remaining vertical space for a single line in our editor and space between buttons */
    margin: ${token('space.050', '4px')};

    &:hover {
      background: ${token('color.background.neutral.bold.hovered', N500)};
    }

    &:focus {
      background: ${token('color.background.neutral.bold', N70)};
    }

    &:active,
    &[data-firefox-is-active='true'] {
      background: ${token('color.background.neutral.bold.pressed', N600)};
    }

    &[disabled] {
      background: ${token('color.background.disabled', N50)};
    }
  }
`;
