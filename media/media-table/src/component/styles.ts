import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export const nameCellWrapperStyles = css`
  display: flex;
  align-content: center;
  align-items: center;
`;

export const truncateWrapperStyles = css`
  min-width: 0;
  width: 100%;
  margin-left: ${token('space.050', '4px')};

  span:first-of-type {
    &::first-letter {
      text-transform: capitalize;
    }
  }
`;

export const mediaTableWrapperStyles = css`
  tr {
    cursor: pointer;

    td:empty {
      padding: 0;
    }
  }
`;
