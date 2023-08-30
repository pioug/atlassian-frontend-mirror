import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export const containerStyles = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const groupStyles = css`
  width: 250px;
  padding: ${token('space.250', '20px')};
`;

export const buttonListStyles = css`
  padding-left: 0;
  list-style: none;
`;

export const mVSidebarStyles = css`
  height: calc(100vh - 64px);
  padding: ${token('space.400', '32px')};
  overflow: auto;

  h2 {
    color: ${token('color.text', '#c7d1db')};
    margin-bottom: ${token('space.200', '16px')};
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

export const nativePreviewButtonStyles = css`
  height: 125px;
  width: 156px;
  background: none;
  overflow: hidden;
  appearance: none;
  padding: 0;
`;
