import { css } from '@emotion/react';
import { B75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const fakeCursorStyles = css`
  .ProseMirror {
    .ProseMirror-fake-text-cursor {
      display: inline;
      pointer-events: none;
      position: relative;
    }

    .ProseMirror-fake-text-cursor::after {
      content: '';
      display: inline;
      top: 0;
      position: absolute;
      border-right: 1px solid ${token('color.border', 'rgba(0, 0, 0, 0.4)')};
    }

    .ProseMirror-fake-text-selection {
      display: inline;
      pointer-events: none;
      position: relative;
      background-color: ${token('color.background.selected', B75)};
    }
  }
`;
