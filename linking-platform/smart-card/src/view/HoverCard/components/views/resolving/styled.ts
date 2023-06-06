import { css, SerializedStyles } from '@emotion/react';

export const loadingViewContainer = css`
  display: flex;
  flex-direction: column;
`;

export const skeletonContainer = css`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  align-items: center;
`;

export const getTitleStyles = (height: number): SerializedStyles => {
  return css`
    flex: 1 0 auto;
    height: ${height}rem;

    span {
      width: 100%;
    }
  `;
};

export const titleBlockStyles = css`
  width: 100%;
  gap: 0.5rem;
`;
