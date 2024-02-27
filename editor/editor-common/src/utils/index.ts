import type {
  Node as PMNode,
  ResolvedPos,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Selection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { hasDocAsParent } from './document';
import { isEmptyParagraph } from './editor-core-utils';

export {
  canApplyAnnotationOnRange,
  containsAnyAnnotations,
  getAnnotationIdsFromRange,
  hasAnnotationMark,
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
  setAllSelection,
  setCellSelection,
  nonNullable,
  stepAddsOneOf,
  stepHasSlice,
  extractSliceFromStep,
  isValidPosition,
  isEmptyParagraph,
  isInLayoutColumn,
  removeBlockMarks,
  filterChildrenBetween,
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
  getNextBreakoutMode,
  getTitle,
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
  isPositionNearTableRow,
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
export { RenderCountProfiler, PROFILER_KEY } from './profiler/render-count';
export {
  validateADFEntity,
  validationErrorHandler,
} from './validate-using-spec';
export { getShallowPropsDifference, getPropsDifference } from './compare-props';
export type { ShallowPropsDifference, PropsDifference } from './compare-props';
export { useComponentRenderTracking } from './performance/hooks/use-component-render-tracking';
export type { UseComponentRenderTrackingArgs } from './performance/hooks/use-component-render-tracking';
export { isOutdatedBrowser } from './outdated-browsers';
export { autoJoinTr } from './prosemirror/autojoin';

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
  isOrderedList,
  isOrderedListContinuous,
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
  canLinkBeCreatedInRange,
} from './hyperlink';

// prosemirror-history does not export its plugin key
export const pmHistoryPluginKey = 'history$';
export { gridTypeForLayout } from './grid';

export {
  nodesBetweenChanged,
  getStepRange,
  isEmptyDocument,
  processRawValue,
  hasDocAsParent,
  bracketTyped,
  hasVisibleContent,
  isSelectionEndOfParagraph,
  getChangedNodes,
} from './document';

export {
  floatingLayouts,
  isRichMediaInsideOfBlockNode,
  calculateSnapPoints,
  alignAttributes,
  nonWrappedLayouts,
} from './rich-media-utils';

export { sanitizeNodeForPrivacy } from './filter/privacy-filter';

export { canRenderDatasource, getDatasourceType } from './datasource';
export {
  filterCommand,
  isEmptySelectionAtStart,
  isEmptySelectionAtEnd,
  insertContentDeleteRange,
  deleteEmptyParagraphAndMoveBlockUp,
  insertNewLineWithAnalytics,
  createNewParagraphAbove,
  createNewParagraphBelow,
  createParagraphNear,
  walkNextNode,
  walkPrevNode,
} from './commands';
export type { WalkNode } from './commands';

export {
  GUTTER_SELECTOR,
  GUTTER_SIZE_IN_PX,
  GUTTER_SIZE_MOBILE_IN_PX,
} from './scroll-gutter';

export { getTimeSince } from './performance/get-performance-timing';

export { countNodes } from './count-nodes';

export function shallowEqual(obj1: any = {}, obj2: any = {}) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  return (
    keys1.length === keys2.length &&
    keys1.reduce((acc, key) => acc && obj1[key] === obj2[key], true)
  );
}

export {
  inputRuleWithAnalytics,
  createWrappingJoinRule,
  createRule,
} from './input-rules';

export function isSelectionInsideLastNodeInDocument(
  selection: Selection,
): boolean {
  const docNode = selection.$anchor.node(0);
  const rootNode = selection.$anchor.node(1);

  return docNode.lastChild === rootNode;
}

export const isInListItem = (state: EditorState): boolean => {
  return hasParentNodeOfType(state.schema.nodes.listItem)(state.selection);
};

/**
 * Find the farthest node given a condition
 * @param predicate Function to check the node
 */
export const findFarthestParentNode =
  (predicate: (node: PMNode) => boolean) =>
  ($pos: ResolvedPos): ContentNodeWithPos | null => {
    let candidate: ContentNodeWithPos | null = null;

    for (let i = $pos.depth; i > 0; i--) {
      const node = $pos.node(i);
      if (predicate(node)) {
        candidate = {
          pos: i > 0 ? $pos.before(i) : 0,
          start: $pos.start(i),
          depth: i,
          node,
        };
      }
    }
    return candidate;
  };

export const insideTableCell = (state: EditorState) => {
  const { tableCell, tableHeader } = state.schema.nodes;
  return hasParentNodeOfType([tableCell, tableHeader])(state.selection);
};

/**
 * Traverse the document until an "ancestor" is found. Any nestable block can be an ancestor.
 */
function findAncestorPosition(doc: PMNode, pos: ResolvedPos): any {
  const nestableBlocks = ['blockquote', 'bulletList', 'orderedList'];

  if (pos.depth === 1) {
    return pos;
  }

  let node: PMNode | undefined = pos.node(pos.depth);
  let newPos = pos;
  while (pos.depth >= 1) {
    pos = doc.resolve(pos.before(pos.depth));
    node = pos.node(pos.depth);

    if (node && nestableBlocks.indexOf(node.type.name) !== -1) {
      newPos = pos;
    }
  }

  return newPos;
}

export function checkNodeDown(
  selection: Selection,
  doc: PMNode,
  filter: (node: PMNode) => boolean,
): boolean {
  const ancestorDepth = findAncestorPosition(doc, selection.$to).depth;

  // Top level node
  if (ancestorDepth === 0) {
    return false;
  }

  const res = doc.resolve(selection.$to.after(ancestorDepth));
  return res.nodeAfter ? filter(res.nodeAfter) : false;
}

export const isEmptyNode = (schema: Schema) => {
  const {
    doc,
    paragraph,
    codeBlock,
    blockquote,
    panel,
    heading,
    listItem,
    bulletList,
    orderedList,
    taskList,
    taskItem,
    decisionList,
    decisionItem,
    media,
    mediaGroup,
    mediaSingle,
  } = schema.nodes;
  const innerIsEmptyNode = (node: PMNode): boolean => {
    switch (node.type) {
      case media:
      case mediaGroup:
      case mediaSingle:
        return false;
      case paragraph:
      case codeBlock:
      case heading:
      case taskItem:
      case decisionItem:
        return node.content.size === 0;
      case blockquote:
      case panel:
      case listItem:
        return (
          node.content.size === 2 && innerIsEmptyNode(node.content.firstChild!)
        );
      case bulletList:
      case orderedList:
        return (
          node.content.size === 4 && innerIsEmptyNode(node.content.firstChild!)
        );
      case taskList:
      case decisionList:
        return (
          node.content.size === 2 && innerIsEmptyNode(node.content.firstChild!)
        );
      case doc:
        let isEmpty = true;
        node.content.forEach((child) => {
          isEmpty = isEmpty && innerIsEmptyNode(child);
        });
        return isEmpty;
      default:
        return isNodeEmpty(node);
    }
  };
  return innerIsEmptyNode;
};

/**
 * Checks if a node has any content. Ignores node that only contain empty block nodes.
 */
export function isNodeEmpty(node?: PMNode): boolean {
  if (node && node.textContent) {
    return false;
  }

  if (
    !node ||
    !node.childCount ||
    (node.childCount === 1 && isEmptyParagraph(node.firstChild))
  ) {
    return true;
  }

  const block: PMNode[] = [];
  const nonBlock: PMNode[] = [];

  node.forEach((child) => {
    child.isInline ? nonBlock.push(child) : block.push(child);
  });

  return (
    !nonBlock.length &&
    !block.filter(
      (childNode) =>
        (!!childNode.childCount &&
          !(
            childNode.childCount === 1 && isEmptyParagraph(childNode.firstChild)
          )) ||
        childNode.isAtom,
    ).length
  );
}

export function isInEmptyLine(state: EditorState) {
  const { selection } = state;
  const { $cursor, $anchor } = selection as TextSelection;

  if (!$cursor) {
    return false;
  }

  const node = $cursor.node();

  if (!node) {
    return false;
  }
  return isEmptyParagraph(node) && hasDocAsParent($anchor);
}

export { dedupe } from './dedupe';

export { createWrapSelectionTransaction } from './create-wrap-selection-transaction';
export { transformNodeIntoListItem } from './insert-node-into-ordered-list';

export { wrapSelectionIn } from './wrap-selection-in';

export { toJSON, nodeToJSON } from './nodes';

export {
  calculateToolbarPositionAboveSelection,
  calculateToolbarPositionTrackHead,
} from './calculate-toolbar-position';

export { findNodePosByLocalIds } from './nodes-by-localIds';
