import { css, SerializedStyles } from '@emotion/react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const loadingViewContainer = css`
  display: flex;
  flex-direction: column;
  ${getBooleanFF(
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg',
  )
    ? `padding: 1rem;`
    : ``}
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
