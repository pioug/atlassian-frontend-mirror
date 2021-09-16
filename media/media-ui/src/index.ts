import * as untypedLocales from './i18n/index';

const locales: { [key: string]: any } = untypedLocales;

export type { ActionProps } from './BlockCard/components/Action';
export { DownloadAction } from './BlockCard/actions/DownloadAction';
export { ViewAction } from './BlockCard/actions/ViewAction';
export {
  AuthorizeAction,
  BlockCardErroredView,
  BlockCardNotFoundView,
  BlockCardForbiddenView,
  BlockCardResolvedView,
  BlockCardResolvingView,
  BlockCardUnauthorisedView,
  ForbiddenAction,
  PreviewAction,
} from './BlockCard';
export type { BlockCardResolvedViewProps } from './BlockCard';
export {
  InlineCardErroredView,
  InlineCardForbiddenView,
  InlineCardResolvedView,
  InlineCardResolvingView,
  InlineCardUnauthorizedView,
} from './InlineCard';
export type {
  InlineCardErroredViewProps,
  InlineCardForbiddenViewProps,
  InlineCardResolvedViewProps,
  InlineCardResolvingViewProps,
  InlineCardUnauthorizedViewProps,
} from './InlineCard';
export {
  MediaInlineCardErroredView,
  MediaInlineCardLoadedView,
  MediaInlineCardLoadingView,
} from './MediaInlineCard';
export type {
  MediaInlineCardErroredViewProps,
  MediaInlineCardLoadedViewProps,
  MediaInlineCardLoadingViewProps,
} from './MediaInlineCard';
export { CardLinkView } from './LinkView';
export { Ellipsify } from './ellipsify';
export type { EllipsifyProps } from './ellipsify';
export { toHumanReadableMediaSize } from './humanReadableSize';
export {
  absolute,
  borderRadius,
  borderRadiusBottom,
  center,
  easeInOutCubic,
  ellipsis,
  fadeIn,
  fadeInKeyframe,
  size,
} from './mixins';
export type { LozengeColor, LozengeProps } from './common';
export { Bounds, Camera, Rectangle, Vector2 } from './camera';
export { messages } from './messages';
export type { MessageKey } from './messages';
export { default as languages } from './i18n/languages';
export { locales };
export { InfiniteScroll } from './infiniteScroll';
export type {
  InfiniteScrollProps,
  InfiniteScrollState,
  ThresholdReachedEventHandler,
} from './infiniteScroll';
export {
  ExifOrientation,
  getCssFromImageOrientation,
  getImageInfo,
  getMetaTagNumericValue,
  getOrientation,
  getScaleFactor,
  getScaleFactorFromFile,
  isRotated,
  readImageMetaData,
} from './imageMetaData';
export type {
  FileInfo,
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
} from './imageMetaData';
export {
  dataURItoFile,
  fileToArrayBuffer,
  fileToDataURI,
  getFileInfo,
  getFileInfoFromSrc,
  loadImage,
  findParentByClassname,
  getMimeIcon,
} from './util';
export { MimeTypeIcon } from './mime-type-icon';
export { CustomMediaPlayer } from './customMediaPlayer/index';
export { TimeRange } from './customMediaPlayer/timeRange';
export type {
  TimeRangeProps,
  TimeRangeState,
} from './customMediaPlayer/timeRange';
export { hideControlsClassName } from './classNames';
export { Shortcut, keyCodes } from './shortcut';
export type { ShortcutProps } from './shortcut';
export { formatDuration } from './formatDuration';
export { default as MediaButton } from './MediaButton';
export { default as ModalSpinner } from './modalSpinner';
export { MediaImage } from './mediaImage';
export type { MediaImageProps, MediaImageState } from './mediaImage';
export { InactivityDetector } from './inactivityDetector/inactivityDetector';
export type {
  WithShowControlMethodProp,
  AccessTypes,
  AccessContext,
  RequestAccessContextProps,
} from './types';
export { isIntersectionObserverSupported } from './intersectionObserver';
export { Truncate } from './truncateText';
export type { TruncateProps } from './truncateText';
export { errorIcon } from './errorIcon';
export { formatDate } from './formatDate';
