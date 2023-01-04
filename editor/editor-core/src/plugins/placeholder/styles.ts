import { css } from '@emotion/react';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const placeholderStyles = css`
  .ProseMirror .placeholder-decoration {
    color: ${token('color.text.subtlest', N200)};
    width: 100%;
    pointer-events: none;
    user-select: none;
  }
`;
