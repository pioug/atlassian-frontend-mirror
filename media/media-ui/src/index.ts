import * as untypedLocales from './i18n/index';

const locales: { [key: string]: any } = untypedLocales;

export { ActionProps } from './BlockCard/components/Action';
export { DownloadAction } from './BlockCard/actions/DownloadAction';
export { ViewAction } from './BlockCard/actions/ViewAction';
export {
  AuthorizeAction,
  BlockCardErroredView,
  BlockCardNotFoundView,
  BlockCardForbiddenView,
  BlockCardResolvedView,
  BlockCardResolvedViewProps,
  BlockCardResolvingView,
  BlockCardUnauthorisedView,
  ForbiddenAction,
  PreviewAction,
} from './BlockCard';
export {
  InlineCardErroredView,
  InlineCardErroredViewProps,
  InlineCardForbiddenView,
  InlineCardForbiddenViewProps,
  InlineCardResolvedView,
  InlineCardResolvedViewProps,
  InlineCardResolvingView,
  InlineCardResolvingViewProps,
  InlineCardUnauthorizedView,
  InlineCardUnauthorizedViewProps,
} from './InlineCard';
export { CardLinkView } from './LinkView';
export { Ellipsify, EllipsifyProps } from './ellipsify';
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
export { LozengeColor, LozengeProps } from './common';
export { Bounds, Camera, Rectangle, Vector2 } from './camera';
export { MessageKey, messages } from './messages';
export { default as languages } from './i18n/languages';
export { locales };
export {
  InfiniteScroll,
  InfiniteScrollProps,
  InfiniteScrollState,
  ThresholdReachedEventHandler,
} from './infiniteScroll';
export {
  ExifOrientation,
  FileInfo,
  ImageInfo,
  ImageMetaData,
  ImageMetaDataTags,
  getCssFromImageOrientation,
  getImageInfo,
  getMetaTagNumericValue,
  getOrientation,
  getScaleFactor,
  getScaleFactorFromFile,
  isRotated,
  readImageMetaData,
} from './imageMetaData';
export {
  dataURItoFile,
  fileToArrayBuffer,
  fileToDataURI,
  getFileInfo,
  getFileInfoFromSrc,
  loadImage,
  findParentByClassname,
} from './util';
export { default as CustomMediaPlayer } from './customMediaPlayer/index';
export {
  TimeRange,
  TimeRangeProps,
  TimeRangeState,
} from './customMediaPlayer/timeRange';
export { hideControlsClassName } from './classNames';
export { Shortcut, ShortcutProps, keyCodes } from './shortcut';
export { formatDuration } from './formatDuration';
export { default as MediaButton } from './MediaButton';
export { default as ModalSpinner } from './modalSpinner';
export { MediaImage, MediaImageProps, MediaImageState } from './mediaImage';
export { InactivityDetector } from './inactivityDetector/inactivityDetector';
export { WithShowControlMethodProp } from './types';
