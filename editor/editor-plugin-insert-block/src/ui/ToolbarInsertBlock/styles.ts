import { css } from '@emotion/react';

export const triggerWrapper = css`
  width: 42px;

  display: flex;
  align-items: center;

  > div,
  > span {
    display: flex;
  }

  > div > div {
    display: flex;
  }
`;
