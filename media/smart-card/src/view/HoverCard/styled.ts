import { css } from '@emotion/core';
import { loadingPlaceholderClassName } from '../../index';

export const HoverCardContainer = css`
  background: none;
  border-width: 0;
  box-sizing: border-box;
  width: 24rem;
  padding: 1rem;

  .${loadingPlaceholderClassName} {
    display: none;
  }
`;

export const titleBlockCss = css`
  gap: 0.5rem;
`;

export const metadataBlockCss = css`
  gap: 0px;

  /* primary element group */
  [data-smart-element-group]:first-of-type {
    flex-grow: 7;
    /* horizontal spacing between elements in group */
    > span {
      margin-right: 0.5rem;
    }
  }
  /* secondary element group */
  [data-smart-element-group]:last-of-type {
    flex-grow: 3;
    /* horizontal spacing between elements in group */
    > span {
      margin-left: 0.5rem;
    }
  }
`;

export const footerBlockCss = css`
  padding-top: 0.25rem;
`;
