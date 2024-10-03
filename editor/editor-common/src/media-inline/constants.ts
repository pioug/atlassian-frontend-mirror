export const DEFAULT_IMAGE_WIDTH = 250;
export const DEFAULT_IMAGE_HEIGHT = 200;
export const DEFAULT_INLINE_IMAGE_ASPECT_RATIO = DEFAULT_IMAGE_WIDTH / DEFAULT_IMAGE_HEIGHT;
export const DEFAULT_INLINE_IMAGE_BORDER_SIZE = 0;

/**
 * Reference Heights
 *
 * These heights enforce consistent sizes with media inline nodes due to
 * inconsistencies with center aligned inline nodes and text.
 *
 * There is conversation about refactoring media inline nodes to conform to
 * aligning correctly with the surrounding text.
 *
 * These constants originally came from `headingSizes` from the `theme` package
 * and have been copied here to remove this package.
 */
export const referenceHeights = {
	p: 24 - 2,
	h1: 32 + 4,
	h2: 28 + 3,
	h3: 24 + 1,
	h4: 20 + 3,
	h5: 16 + 4,
	h6: 16 + 2,
};
