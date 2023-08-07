import type { RichMediaLayout } from '@atlaskit/adf-schema';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorGutterPadding,
  breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import {
  DEFAULT_IMAGE_WIDTH,
  MEDIA_SINGLE_MIN_PIXEL_WIDTH,
  wrappedLayouts,
} from './constants';

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

export interface calcMediaSinglePixelWidthProps {
  width?: number;
  widthType?: 'percentage' | 'pixel';
  origWidth: number;
  layout: RichMediaLayout;
  contentWidth?: number;
  containerWidth: number;
  gutterOffset: number;
}
/**
 * Convert width attribute to pixel value for legacy (resized or not resisized) and new media single node for new experience
 * @param width node width attribute
 * @param widthType node widthType attribute
 * @param origWidth original media width
 * @param layout node layout attribute
 * @param contentWidth editor content width
 * @param containerWidth editor container width
 * @param gutterOffset gap between resizer handle and media
 * @returns pixel width of the node
 */
export const calcMediaSinglePixelWidth = ({
  width,
  widthType = 'percentage',
  origWidth,
  layout,
  contentWidth,
  containerWidth,
  gutterOffset = 0,
}: calcMediaSinglePixelWidthProps): number => {
  if (widthType === 'pixel' && width) {
    return width;
  }

  switch (layout) {
    case 'wide':
      return calcLegacyWideWidth(containerWidth, origWidth, contentWidth);
    case 'full-width':
      // legacy and new experience have different definitions of full-width,
      // since it's for new experience, we convert to the new definition
      return calcMediaSingleMaxWidth(containerWidth);
    default:
      if (width) {
        return Math.ceil(
          ((contentWidth || containerWidth) + gutterOffset) * (width / 100) -
            gutterOffset,
        );
      }
  }

  // Handle the case of not resized node with wrapped layout
  // It's possible that the node is first inserted with align layout (e.g. jira)
  // in which the legacy image would render the width as min(origWidth, halfContentWidth).
  // However, new experience won't be able to distinguish the two. Thus, we render halfContentWidth
  // to make sure confluence legacy node is renderered correctly
  if (wrappedLayouts.includes(layout)) {
    return Math.ceil((contentWidth || containerWidth) / 2);
  }

  // set initial width for not resized legacy image
  return getMediaSingleInitialWidth(
    origWidth,
    // in case containerWidth is 0, we fallback to undefined to use akEditorDefaultLayoutWidth
    contentWidth || containerWidth || undefined,
  );
};

/**
 * Calculate pixel width for legacy media single
 * @param contentWidth editor content width
 * @param containerWidth editor container width
 */
const calcLegacyWideWidth = (
  containerWidth: number,
  origWidth: number,
  contentWidth?: number,
) => {
  if (contentWidth) {
    const wideWidth = Math.ceil(contentWidth * breakoutWideScaleRatio);
    return wideWidth > containerWidth ? contentWidth : wideWidth;
  }
  return origWidth;
};

/**
 * Calculate maximum width allowed for media single in new experience
 * @param containerWidth width of editor container
 */
export const calcMediaSingleMaxWidth = (containerWidth: number) => {
  const fullWidthPadding = akEditorGutterPadding * 2;
  return Math.min(
    containerWidth - fullWidthPadding,
    akEditorFullWidthLayoutWidth,
  );
};

/**
 * Calculate initial media single pixel width.
 * Make it fall between max width and min width
 * @param origWidth original width of image (media node width)
 * @param maxWidth default to akEditorDefaultLayoutWidth (760)
 * @param minWidth default to MEDIA_SINGLE_MIN_PIXEL_WIDTH (24)
 */
export const getMediaSingleInitialWidth = (
  origWidth: number = DEFAULT_IMAGE_WIDTH,
  maxWidth: number = akEditorDefaultLayoutWidth,
  minWidth: number = MEDIA_SINGLE_MIN_PIXEL_WIDTH,
) => {
  return Math.max(Math.min(origWidth, maxWidth), minWidth);
};
export function calculateOffsetLeft(
  insideInlineLike: boolean,
  insideLayout: boolean,
  pmViewDom: Element,
  wrapper?: HTMLElement,
) {
  let offsetLeft = 0;
  if (wrapper && insideInlineLike && !insideLayout) {
    const currentNode: HTMLElement = wrapper;
    const boundingRect = currentNode.getBoundingClientRect();
    offsetLeft = boundingRect.left - pmViewDom.getBoundingClientRect().left;
  }
  return offsetLeft;
}
