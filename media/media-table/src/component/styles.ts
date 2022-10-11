import { css } from '@emotion/react';
import { N20 } from '@atlaskit/theme/colors';

export const nameCellWrapperStyles = css`
  display: flex;
  align-content: center;
  align-items: center;
`;

export const truncateWrapperStyles = css`
  min-width: 0;
  width: 100%;
  margin-left: 4px;

  span:first-of-type {
    &::first-letter {
      text-transform: capitalize;
    }
  }
`;

export const mediaTableWrapperStyles = css`
  tr {
    cursor: pointer;

    &:hover,
    &:focus {
      background: ${N20};
    }

    td:empty {
      padding: 0;
    }
  }
`;
