import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

import { borderRadius } from '@atlaskit/theme/constants';
import { N50A } from '@atlaskit/theme/colors';

// Using module augmentation to add crossOrigin attribute as it does not exist yet, PR has been opened in
// DefinitelyTyped for it
declare module 'react' {
  interface ImgHTMLAttributes<T> {
    alt?: string;
    crossOrigin?: 'anonymous' | 'use-credentials' | '';
    height?: number | string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    useMap?: string;
    width?: number | string;
  }
}

export const containerStyles = css`
  position: relative;
  overflow: hidden;
  border-radius: ${borderRadius()}px;
`;

export const imageContainerStyles = css`
  position: absolute;
  /* Is needed so image is not selected, when dragged */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
  border-radius: ${borderRadius()}px;
`;

export const CONTAINER_PADDING = 28;

const maskStyles = css`
  position: absolute;
  top: ${CONTAINER_PADDING}px;
  bottom: ${CONTAINER_PADDING}px;
  left: ${CONTAINER_PADDING}px;
  right: ${CONTAINER_PADDING}px;
  box-shadow: 0 0 0 100px
    ${token('elevation.surface.overlay', 'rgba(255, 255, 255)')};
  opacity: ${token('opacity.disabled', '0.5')};
`;

export const rectMaskStyles = css`
  ${maskStyles};
  border-radius: ${borderRadius()}px;
`;

export const circularMaskStyles = css`
  ${maskStyles};
  border-radius: 500px;
`;

export const dragOverlayStyles = css`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: move;
`;

export const removeImageContainerStyles = css`
  position: absolute;
  right: 4px;
  top: 4px;
`;

export const removeImageButtonStyles = css`
  border-radius: ${borderRadius()}px;
  background-color: transparent;
  width: 24px;
  height: 24px;
  border: none;
  cursor: pointer;
  padding: 0;

  svg {
    position: absolute;
    top: 4px;
    left: 4px;
  }

  &:hover {
    background-color: ${token('color.background.neutral.hovered', N50A)};
  }
`;
