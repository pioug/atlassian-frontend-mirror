import { css } from '@emotion/react';

import { B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  DEFAULT_INLINE_IMAGE_ASPECT_RATIO,
  DEFAULT_INLINE_IMAGE_BORDER_SIZE,
  referenceHeights,
} from './constants';

export const INLINE_IMAGE_WRAPPER_CLASS_NAME = 'media-inline-image-wrapper';

export const INLINE_IMAGE_ASPECT_RATIO_CSS_VAR_KEY =
  '--editor-media-inline-image-aspect-ratio';

export const INLINE_IMAGE_BORDER_SIZE_CSS_VAR_KEY =
  '--editor-media-inline-image-border-size';

export const INLINE_IMAGE_BORDER_COLOR_CSS_VAR_KEY =
  '--editor-media-inline-image-border-color';

// We implemented such selectors to ensure specificity:
const inlineImageHeight = (height: number | string, margin: number = 0) => css`
  /* Editor style */
  > .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .mediaInlineView-content-wrap > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  /* Renderer style */
  > .${INLINE_IMAGE_WRAPPER_CLASS_NAME},
  > :is(a, span[data-mark-type='border']) .${INLINE_IMAGE_WRAPPER_CLASS_NAME} {
    height: ${height}px;
    transform: translateY(${margin}px);
  }
`;

/**
 * Shifting the mediaInline image component (renders image) to align nicely with
 * mediaInline (renders text) is a bit of a testing ground. This numbers represent
 * shift in top and bottom and size adjustments to make up for lack of 1to1 size
 * mapping
 */
export const mediaInlineImageStyles = css`
  // p, h3, and action items
  .${INLINE_IMAGE_WRAPPER_CLASS_NAME} {
    height: ${referenceHeights['p']}px;
    transform: translateY(-2px);
  }

  h1 {
    ${inlineImageHeight(referenceHeights['h1'], -3)}
  }

  h2 {
    ${inlineImageHeight(referenceHeights['h2'], -3)}
  }

  h3 {
    ${inlineImageHeight(referenceHeights['h3'], -2)}
  }

  h4 {
    ${inlineImageHeight(referenceHeights['h4'], -2)}
  }

  h5 {
    ${inlineImageHeight(referenceHeights['h5'], -2)}
  }

  h6 {
    ${inlineImageHeight(referenceHeights['h6'], -2)}
  }
`;

export const wrapperStyle = css({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  borderRadius: `${token('border.radius', '3px')}`,
  aspectRatio: `var(${INLINE_IMAGE_ASPECT_RATIO_CSS_VAR_KEY}, ${DEFAULT_INLINE_IMAGE_ASPECT_RATIO})`,
  maxWidth: '100%',
});

export const selectedStyle = css({
  cursor: 'pointer',
  boxShadow: `0 0 0 1px ${token('color.border.selected', B300)}`,
  outline: 'none',
});

export const borderStyle = css({
  borderColor: `var(${INLINE_IMAGE_BORDER_COLOR_CSS_VAR_KEY})`,
  borderStyle: 'solid',
  borderRadius: `calc(var(${INLINE_IMAGE_BORDER_SIZE_CSS_VAR_KEY}, ${DEFAULT_INLINE_IMAGE_BORDER_SIZE}) * 2px)`,
  borderWidth: `calc(var(${INLINE_IMAGE_BORDER_SIZE_CSS_VAR_KEY}, ${DEFAULT_INLINE_IMAGE_BORDER_SIZE}) * 1px)`,
  boxSizing: `border-box`,
});
