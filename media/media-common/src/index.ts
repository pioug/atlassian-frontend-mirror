export { downloadUrl } from './downloadUrl';

export type { MediaType, FileStatus, NumericalCardDimensions, SSR } from './main-types';

// Media Feature Flags
export {
	getMediaFeatureFlag,
	defaultMediaFeatureFlags,
	filterFeatureFlagNames,
	getFeatureFlagKeysAllProducts,
} from './mediaFeatureFlags';
export type { MediaFeatureFlags, WithMediaFeatureFlags } from './mediaFeatureFlags';

// Analytics base types
export type {
	PackageAttributes,
	WithFileAttributes,
	WithPerformanceAttributes,
	WithTraceContext,
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
	MediaTraceContext,
} from './analytics/types';

// Analytics context
export { withMediaAnalyticsContext } from './analytics/withMediaAnalyticsContext';

// Analytics constants
export { ANALYTICS_MEDIA_CHANNEL } from './analytics/constants';

export {
	getMediaTypeFromMimeType,
	isImageMimeTypeSupportedByBrowser,
	isDocumentMimeTypeSupportedByBrowser,
	isVideoMimeTypeSupportedByBrowser,
	isMimeTypeSupportedByBrowser,
	isImageMimeTypeSupportedByServer,
	isDocumentMimeTypeSupportedByServer,
	isAudioMimeTypeSupportedByServer,
	isVideoMimeTypeSupportedByServer,
	isUnknownMimeTypeSupportedByServer,
	isMimeTypeSupportedByServer,
} from './mediaTypeUtils';

export {
	isUndefined,
	pick,
	omitBy,
	debounce,
	matches,
	getRandomHex,
	getRandomTelemetryId,
} from './utils/helpers';

export { useStaticCallback } from './hooks';

// Cross-client copy/paste utilities
export {
	setClientIdForFile,
	getClientIdForFile,
	clearClientIdCache,
	extractClientIdsFromHtml,
} from './copyIntent';
