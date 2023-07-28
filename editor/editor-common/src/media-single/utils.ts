/**
 * Convert media node width to pixel
 *
 * for legacy experience, image is aligned inside resize handle bar with a gap. So gutterOffset is used to for this use case.
 * for new expereience, image is aligned with resize handle bar, so gutterOffset is 0
 *
 * @param width - media single node width
 * @param editorWidth - width of editor
 * @param widthType - width type is defined in the adf document for mediaSingle node, and it is assoicated with the `width`
 * @param gutterOffset - resize handle bar offset, determines whether align with resize handle bar
 * @returns pixel number for media single node
 */
export function getMediaSinglePixelWidth(
  width: number,
  editorWidth: number,
  widthType = 'percentage',
  gutterOffset = 0,
): number {
  if (widthType === 'pixel') {
    return width;
  }
  return Math.ceil((editorWidth + gutterOffset) * (width / 100) - gutterOffset);
}
