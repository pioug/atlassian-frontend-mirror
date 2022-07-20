import { css } from '@emotion/react';

export const containerStyles = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const groupStyles = css`
  width: 250px;
  padding: 20px;
`;

export const buttonListStyles = css`
  padding-left: 0;
  list-style: none;
`;

export const mVSidebarStyles = css`
  height: calc(100vh - 64px);
  padding: 32px;
  overflow: auto;

  h2 {
    color: white;
    margin-bottom: 16px;
  }

  tbody {
    border-bottom: none;
    vertical-align: top;
  }
`;

export const mVSidebarHeaderStyles = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
