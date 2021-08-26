export { downloadUrl } from './downloadUrl';
// Warning! You can't add new media types!
// See packages/media/media-core/src/__tests__/cache-backward-compatibility.spec.ts
export type MediaType =
  | 'doc'
  | 'audio'
  | 'video'
  | 'image'
  | 'archive'
  | 'unknown';

export type FileStatus =
  | 'uploading'
  | 'processing'
  | 'processed'
  | 'error'
  | 'failed-processing';

// Media Feature Flags
export {
  getMediaFeatureFlag,
  defaultMediaFeatureFlags,
} from './mediaFeatureFlags';
export type {
  MediaFeatureFlags,
  WithMediaFeatureFlags,
} from './mediaFeatureFlags';
// TODO EDM-689 Please, consolidate these two CardDimensions types
export interface NumericalCardDimensions {
  width: number;
  height: number;
}

// Analytics base types
export type {
  PackageAttributes,
  WithFileAttributes,
  WithPerformanceAttributes,
  FileAttributes,
  PerformanceAttributes,
  SuccessAttributes,
  FailureAttributes,
  OperationalAttributes,
  OperationalEventPayload,
  UIAttributes,
  UIEventPayload,
  ScreenAttributes,
  ScreenEventPayload,
  TrackAttributes,
  TrackEventPayload,
  ContextPublicAttributes,
  ContextStaticProps,
} from './analytics/types';

// Analytics context
export { withMediaAnalyticsContext } from './analytics/withMediaAnalyticsContext';

// Analytics constants
export { ANALYTICS_MEDIA_CHANNEL } from './analytics/constants';

export {
  getMediaTypeFromMimeType,
  isImageMimeTypeSupportedByBrowser,
  isDocumentMimeTypeSupportedByBrowser,
  isMimeTypeSupportedByBrowser,
  isImageMimeTypeSupportedByServer,
  isDocumentMimeTypeSupportedByServer,
  isAudioMimeTypeSupportedByServer,
  isVideoMimeTypeSupportedByServer,
  isUnknownMimeTypeSupportedByServer,
  isMimeTypeSupportedByServer,
} from './mediaTypeUtils';
