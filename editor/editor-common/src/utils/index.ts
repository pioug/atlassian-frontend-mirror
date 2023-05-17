export {
  canApplyAnnotationOnRange,
  getAnnotationIdsFromRange,
} from './annotation';
export { getExtensionLozengeData } from './macro';
export type { Params } from './macro';
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
export {
  isElementInTableCell,
  isTextSelection,
  isLastItemMediaGroup,
  setNodeSelection,
  setTextSelection,
  nonNullable,
  stepAddsOneOf,
  stepHasSlice,
  extractSliceFromStep,
  isValidPosition,
  isEmptyParagraph,
} from './editor-core-utils';
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
  calculateBreakoutStyles,
  calcBreakoutWidthPx,
} from './breakout';

export {
  findChangedNodesFromTransaction,
  validNode,
  validateNodes,
  isType,
  isParagraph,
  isText,
  isLinkMark,
  SelectedState,
  isNodeSelectedOrInRange,
  isSupportedInParent,
  isMediaNode,
  isNodeBeforeMediaNode,
} from './nodes';

export type { Reducer } from './plugin-state-factory';
export { pluginFactory } from './plugin-state-factory';

export {
  getFragmentBackingArray,
  mapFragment,
  mapSlice,
  flatmap,
  mapChildren,
} from './slice';
export type { FlatMapCallback, MapWithCallback } from './slice';

export {
  walkUpTreeUntil,
  unwrap,
  removeNestedEmptyEls,
  containsClassName,
  closest,
  closestElement,
  parsePx,
  mapElem,
  maphElem,
} from './dom';
export type { MapCallback } from './dom';

export { default as ADFTraversor } from './traversor';
export {
  analyticsEventKey,
  getAnalyticsAppearance,
  getAnalyticsEditorAppearance,
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
export {
  getDistortedDurationMonitor,
  measureRender,
} from './performance/measure-render';
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
export { isTextInput } from './is-text-input';
export { ZERO_WIDTH_SPACE, ZERO_WIDTH_JOINER } from './whitespace';

export type { Diff } from './types';
export { shouldForceTracking } from './should-force-tracking';
export { getModeFromTheme } from './getModeFromTheme';
export {
  getPerformanceOptions,
  startMeasureReactNodeViewRendered,
  stopMeasureReactNodeViewRendered,
} from './get-performance-options';
export type { UserBrowserExtensionResults } from './browser-extensions';
export { sniffUserBrowserExtensions } from './browser-extensions';
export { RenderCountProfiler } from './profiler/render-count';
export {
  validateADFEntity,
  validationErrorHandler,
} from './validate-using-spec';
export { getShallowPropsDifference, getPropsDifference } from './compare-props';
export type { ShallowPropsDifference, PropsDifference } from './compare-props';
export { useComponentRenderTracking } from './performance/hooks/use-component-render-tracking';
export type { UseComponentRenderTrackingArgs } from './performance/hooks/use-component-render-tracking';
export { isOutdatedBrowser } from './outdated-browsers';

export {
  isReferencedSource,
  removeConnectedNodes,
  getChildrenInfo,
  getNodeName,
} from './referentiality';

export {
  getItemCounterDigitsSize,
  getOrderFromOrderedListNode,
  resolveOrder,
  isListNode,
  isParagraphNode,
  isListItemNode,
  isBulletList,
} from './list';

export {
  isFromCurrentDomain,
  LinkMatcher,
  normalizeUrl,
  linkifyContent,
  getLinkDomain,
  findFilepaths,
  isLinkInMatches,
  FILEPATH_REGEXP,
  DONTLINKIFY_REGEXP,
  getLinkCreationAnalyticsEvent,
} from './hyperlink';

// prosemirror-history does not export its plugin key
export const pmHistoryPluginKey = 'history$';
