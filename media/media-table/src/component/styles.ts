import { css } from '@emotion/react';

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

    td:empty {
      padding: 0;
    }
  }
`;
