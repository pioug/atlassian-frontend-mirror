import { css } from '@emotion/core';
import { loadingPlaceholderClassName } from '../../index';

export const HoverCardContainer = css`
  background: none;
  border-width: 0;
  max-width: 350px;
  padding: 0;

  .${loadingPlaceholderClassName} {
    display: none;
  }
`;
