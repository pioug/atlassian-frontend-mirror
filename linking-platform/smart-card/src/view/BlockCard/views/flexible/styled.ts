import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { N40 } from '@atlaskit/theme/colors';

// in editor prosemirror adds padding-left so we need to overwrite it
// renderer overwrites the margin-right so we need to add it here
export const metadataBlockCss = css`
  /* primary element group */
  span[data-smart-element-avatar-group] {
    > ul {
      padding-left: 0px;
      margin-right: 0.5rem;
    }
  }
  [data-smart-element-group] {
    line-height: 1rem;
  }
`;
export const titleBlockCss = css`
  gap: 0.5em;

  [data-smart-element='Title'] {
    font-weight: 600;
  }
`;

export const footerBlockCss = css`
  height: 1.5rem;

  .actions-button-group {
    button,
    button:hover,
    button:focus,
    button:active {
      font-size: 0.875rem;
    }
  }
`;

export const flexibleBlockCardStyle = css`
  & > div {
    border-radius: ${token('border.radius.200', '8px')};
    border: 1px solid ${token('color.border', N40)};
  }
`;
