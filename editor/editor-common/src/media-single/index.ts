// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export {
	MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
	MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH,
	MEDIA_SINGLE_SNAP_GAP,
	MEDIA_SINGLE_HIGHLIGHT_GAP,
	MEDIA_SINGLE_GUTTER_SIZE,
	MEDIA_SINGLE_RESIZE_THROTTLE_TIME,
	Layout as MediaSingleLayout,
	DEFAULT_IMAGE_WIDTH,
	DEFAULT_IMAGE_HEIGHT,
	wrappedLayouts,
	CAPTION_PLACEHOLDER_ID,
	MEDIA_SINGLE_ADJACENT_HANDLE_MARGIN,
} from './constants';
export {
	getMediaSinglePixelWidth,
	calcMediaSinglePixelWidth,
	calcMediaSingleMaxWidth,
	getMediaSingleInitialWidth,
	calculateOffsetLeft,
	roundToNearest,
	calcMinWidth,
	getMaxWidthForNestedNode,
	getMaxWidthForNestedNodeNext,
	currentMediaNodeWithPos,
} from './utils';
export { CommentBadge } from './CommentBadge';
export { CommentBadgeNext } from './CommentBadgeNext';
export { ExternalImageBadge } from './ExternalImageBadge';
export { MediaBadges } from './MediaBadges';
export type { CommentBadgeProps } from './CommentBadge';
