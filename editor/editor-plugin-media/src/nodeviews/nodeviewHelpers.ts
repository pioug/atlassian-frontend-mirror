import {
	akEditorFullWidthLayoutWidth,
	akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';

const MIN_MEDIA_DISPLAY_WIDTH = 24;
/**
 * Computes the new mediaSingle display width that preserves the original display height
 * when a media node is replaced with a file of a different aspect ratio, clamped to valid bounds.
 *
 * @param targetDisplayHeight - The display height to preserve (from the old image)
 * @param newIntrinsicWidth - The new file's intrinsic pixel width
 * @param newIntrinsicHeight - The new file's intrinsic pixel height
 * @param layout - The mediaSingle layout (affects max width)
 * @param lineLength - The editor content column width in pixels
 */
export const computeReplacementDisplayWidth = (
	targetDisplayHeight: number,
	newIntrinsicWidth: number,
	newIntrinsicHeight: number,
	layout: string,
	lineLength: number,
): number => {
	if (newIntrinsicHeight <= 0) {
		return MIN_MEDIA_DISPLAY_WIDTH;
	}
	const unclamped = targetDisplayHeight * (newIntrinsicWidth / newIntrinsicHeight);

	const maxWidth =
		layout === 'full-width'
			? akEditorFullWidthLayoutWidth
			: layout === 'wide'
				? akEditorWideLayoutWidth
				: lineLength;

	return Math.max(MIN_MEDIA_DISPLAY_WIDTH, Math.min(unclamped, maxWidth));
};
