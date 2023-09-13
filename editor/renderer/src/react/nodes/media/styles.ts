import { css } from '@emotion/react';

export const linkStyle = css`
  position: absolute;
  background: transparent;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  cursor: pointer;
  width: 100% !important;
  height: 100% !important;
`;

export const borderStyle = (color: string, width: number) => css`
  position: absolute;
  width: 100% !important;
  height: 100% !important;
  border-radius: ${width}px;
  box-shadow: 0 0 0 ${width}px ${color};
`;
