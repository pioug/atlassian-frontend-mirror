import { css } from 'styled-components';

export const truncate = (width = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const focusOutline = color => css`
  outline: none;
  box-shadow: 0 0 0 2px ${color || ''};
`;
