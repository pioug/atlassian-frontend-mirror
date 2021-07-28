export {
  canApplyAnnotationOnRange,
  getAnnotationIdsFromRange,
} from './annotation';
export { getExtensionLozengeData } from './macro';
export type { Params } from './macro';
export {
  getMarksByOrder,
  getValidContent,
  getValidDocument,
  getValidMark,
  getValidNode,
  getValidUnknownNode,
  isSameMark,
  isSubSupType,
  markOrder,
} from './validator';
export type {
  ADDoc,
  ADFStage,
  ADFStages,
  ADMark,
  ADMarkSimple,
  ADNode,
} from './validator';
export { default as browser } from './browser';
export { default as ErrorReporter } from './error-reporter';
export type { ErrorReportingHandler } from './error-reporter';
export {
  isPastDate,
  timestampToIsoFormat,
  timestampToString,
  timestampToTaskContext,
  timestampToUTCDate,
  todayTimestampInUTC,
} from './date';
export type { Date } from './date';
export { withImageLoader } from './imageLoader';
export type {
  ImageLoaderProps,
  ImageLoaderState,
  ImageStatus,
} from './imageLoader';
export {
  absoluteBreakoutWidth,
  calcBreakoutWidth,
  calcWideWidth,
  breakoutConsts,
} from './breakout';
export { default as ADFTraversor } from './traversor';
export {
  analyticsEventKey,
  getAnalyticsAppearance,
  getAnalyticsEventSeverity,
  SEVERITY,
  getUnsupportedContentLevelData,
  UNSUPPORTED_CONTENT_LEVEL_SEVERITY,
  UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS,
} from './analytics';
export type {
  UnsupportedContentTooltipPayload,
  UnsupportedContentPayload,
  UnsupportedContentLevelsTracking,
} from './analytics';
export { findAndTrackUnsupportedContentNodes } from './track-unsupported-content';
export { measureRender } from './performance/measure-render';
export { startMeasure, stopMeasure, clearMeasure } from './performance/measure';
export {
  measureTTI,
  getTTISeverity,
  TTI_SEVERITY_THRESHOLD_DEFAULTS,
  TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS,
} from './performance/measure-tti';
export {
  isPerformanceAPIAvailable,
  isPerformanceObserverAvailable,
} from './performance/is-performance-api-available';
export { getResponseEndTime } from './performance/navigation';
export { getExtensionRenderer } from './extension-handler';

export {
  hasMergedCell,
  calcTableColumnWidths,
  convertProsemirrorTableNodeToArrayOfRows,
} from './table';
export { createCompareNodes } from './compareNodes';
export { compose } from './compose';
export { ZERO_WIDTH_SPACE } from './whitespace';

export type { Diff } from './types';
export { shouldForceTracking } from './should-force-tracking';
export { getModeFromTheme } from './getModeFromTheme';
export type { UserBrowserExtensionResults } from './browser-extensions';
export { sniffUserBrowserExtensions } from './browser-extensions';
