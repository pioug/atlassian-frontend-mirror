import type { RichMediaLayout } from '@atlaskit/adf-schema';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  akEditorDefaultLayoutWidth,
  akEditorFullWidthLayoutWidth,
  akEditorGutterPadding,
  breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';

import {
  floatingLayouts,
  isRichMediaInsideOfBlockNode,
} from '../utils/rich-media-utils';

import {
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_ROUNDING_INTERVAL,
  MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
  MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH,
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
 * Calculate maximum width allowed for media single node in fix-width editor in new experience
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
 * @param minWidth default to MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH (24)
 */
export const getMediaSingleInitialWidth = (
  origWidth: number = DEFAULT_IMAGE_WIDTH,
  maxWidth: number = akEditorDefaultLayoutWidth,
  minWidth: number = MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
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

/**
 * Returns the number rounded to the nearest interval.
 * @param {number} value    The number to round
 * @param {number} interval The numeric interval to round to, default to 0.5
 * @return {number} the rounded number
 */
export const roundToNearest = (
  value: number,
  interval: number = DEFAULT_ROUNDING_INTERVAL,
): number => Math.round(value / interval) * interval;

/**
 * Retuns minimum value for media single node
 * @param isVideoFile is child media of video type
 * @param contentWidth parent content width
 */
export const calcMinWidth = (isVideoFile: boolean, contentWidth: number) => {
  return Math.min(
    contentWidth,
    isVideoFile
      ? MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH
      : MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
  );
};

/**
 * Get parent width for a nested media single node
 * @param view Editor view
 * @param pos node position
 */
export const getMaxWidthForNestedNode = (
  view: EditorView,
  pos: number | undefined,
): number | null => {
  if (typeof pos !== 'number') {
    return null;
  }
  if (isRichMediaInsideOfBlockNode(view, pos)) {
    const $pos = view.state.doc.resolve(pos);
    const domNode = view.nodeDOM($pos.pos);

    if (
      $pos.nodeAfter &&
      floatingLayouts.indexOf($pos.nodeAfter.attrs.layout) > -1 &&
      domNode &&
      domNode.parentElement
    ) {
      return domNode.parentElement.offsetWidth;
    }

    if (domNode instanceof HTMLElement) {
      return domNode.offsetWidth;
    }
  }

  return null;
};

/**
 * Get parent width for a nested media single node for new experience
 * @param view Editor view
 * @param pos node position
 */
export const getMaxWidthForNestedNodeNext = (
  view: EditorView,
  pos: number | undefined,
): number | null => {
  if (typeof pos !== 'number') {
    return null;
  }
  const $pos = view.state.doc.resolve(pos);
  if ($pos && $pos.parent.type.name !== 'doc') {
    return getParentWidthForNestedMediaSingleNode($pos, view);
  }

  return null;
};

export const getParentWidthForNestedMediaSingleNode = (
  resolvedPos: ResolvedPos,
  view: EditorView,
): number | null => {
  const domNode = view.nodeDOM(resolvedPos.pos);

  if (
    resolvedPos.nodeAfter &&
    floatingLayouts.includes(resolvedPos.nodeAfter.attrs.layout) &&
    domNode &&
    domNode.parentElement
  ) {
    const { tableCell, tableHeader } = view.state.schema.nodes;
    if ([tableCell, tableHeader].includes(resolvedPos.parent.type)) {
      // since table has constant padding, use hardcoded constant instead of query the dom
      const tablePadding = 8;
      return domNode.parentElement.offsetWidth - tablePadding * 2;
    }

    return domNode.parentElement.offsetWidth;
  }

  if (domNode instanceof HTMLElement) {
    return domNode.offsetWidth;
  }

  return null;
};
