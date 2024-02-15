import { headingSizes } from '@atlaskit/theme/typography';

export const DEFAULT_IMAGE_WIDTH = 250;
export const DEFAULT_IMAGE_HEIGHT = 200;
export const DEFAULT_INLINE_IMAGE_ASPECT_RATIO =
  DEFAULT_IMAGE_WIDTH / DEFAULT_IMAGE_HEIGHT;
export const DEFAULT_INLINE_IMAGE_BORDER_SIZE = 0;

/**
 * Reference Heights
 *
 * These heights enforce consistent sizes with media inline nodes due to
 * inconsistencies with center aligned inline nodes and text.
 *
 * There is conversation about refactoring media inline nodes to conform to
 * aligning correctly with the surrounding text.
 */
export const referenceHeights = {
  p: headingSizes.h600.lineHeight - 2,
  h1: headingSizes.h800.lineHeight + 4,
  h2: headingSizes.h700.lineHeight + 3,
  h3: headingSizes.h600.lineHeight + 1,
  h4: headingSizes.h500.lineHeight + 3,
  h5: headingSizes.h400.lineHeight + 4,
  h6: headingSizes.h300.lineHeight + 2,
};
