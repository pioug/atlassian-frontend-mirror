/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */
// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import type { Node as PMNode, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import { hasDocAsParent } from './hasDocAsParent';
import { isEmptyParagraph } from './isEmptyParagraph';

export { shouldAutoLinkifyMatch } from './should-auto-linkify-tld';

export {
	getAnnotationMarksForPos,
	canApplyAnnotationOnRange,
	containsAnyAnnotations,
	getAnnotationIdsFromRange,
	getAnnotationInlineNodeTypes,
	hasAnnotationMark,
	getRangeInlineNodeNames,
	getRangeAncestorNodeNames,
	isEmptyTextSelection,
	isEmptyTextSelectionRenderer,
} from './annotation';
export { getExtensionLozengeData } from './macro';
export type { Params } from './macro';
export {
	/**
	 * @private
	 * @deprecated
	 *
	 * Please use `@atlaskit/editor-common/error-reporter` entry-point instead.
	 */
	ErrorReporter,
} from './error-reporter';
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
export { stepAddsOneOf, removeBlockMarks } from './editor-core-utils';
export { extractSliceFromStep } from './extractSliceFromStep';
export { filterChildrenBetween } from './filterChildrenBetween';
export { isElementInTableCell } from './isElementInTableCell';
export { isEmptyParagraph } from './isEmptyParagraph';
export { isInLayoutColumn } from './isInLayoutColumn';
export { isLastItemMediaGroup } from './isLastItemMediaGroup';
export { isTextSelection } from './isTextSelection';
export { isValidPosition } from './isValidPosition';
export { nonNullable } from './nonNullable';
export { setAllSelection } from './setAllSelection';
export { setCellSelection } from './setCellSelection';
export { setNodeSelection } from './setNodeSelection';
export { setTextSelection } from './setTextSelection';
export { stepHasSlice } from './stepHasSlice';
export { withImageLoader } from './imageLoader';
export type { ImageLoaderProps, ImageLoaderState, ImageStatus } from './imageLoader';
export {
	absoluteBreakoutWidth,
	calcBreakoutWidth,
	calcWideWidth,
	breakoutConsts,
	calculateBreakoutStyles,
	calcBreakoutWidthPx,
	calcBreakoutWithCustomWidth,
} from './breakout';
export { breakoutResizableNodes } from './breakoutResizableNodes';
export { getBreakoutResizableNodeTypes } from './getBreakoutResizableNodeTypes';
export { getNextBreakoutMode } from './getNextBreakoutMode';
export { getTitle } from './getTitle';
export type { BreakoutConstsType } from './breakout';

export { SelectedState } from './SelectedState';
export { findChangedNodesFromTransaction } from './findChangedNodesFromTransaction';
export { isMediaNode } from './isMediaNode';
export { isNodeBeforeMediaNode } from './isNodeBeforeMediaNode';
export { isSupportedInParent } from './isSupportedInParent';
export {
	validateNodes,
	isType,
	isParagraph,
	isText,
	isLinkMark,
	isNodeSelectedOrInRange,
} from './nodes';
export { validNode } from './validNode';

export type { Reducer } from './plugin-state-factory';
export { pluginFactory } from './plugin-state-factory';

export { getFragmentBackingArray } from './getFragmentBackingArray';
export { mapFragment, mapSlice, flatmap, mapChildren, hasNode } from './slice';
export type { FlatMapCallback, MapWithCallback } from './slice';

export { containsClassName } from './containsClassName';
export { closest, closestElement, mapElem, maphElem } from './dom';
export { parsePx } from './parsePx';
export { removeNestedEmptyEls } from './removeNestedEmptyEls';
export { unwrap } from './unwrap';
export { walkUpTreeUntil } from './walkUpTreeUntil';
export type { MapCallback } from './dom';

export { default as ADFTraversor } from './traversor';
/**
 * @private
 * @deprecated
 *
 * Use entry-point `@atlaskit/editor-common/utils/analytics` instead
 */
export { SEVERITY } from './SEVERITY';
export {
	analyticsEventKey,
	getAnalyticsEditorAppearance,
	getAnalyticsEventSeverity,
} from './analytics';
export { getAnalyticsAppearance } from './getAnalyticsAppearance';
export { UNSUPPORTED_CONTENT_LEVEL_SEVERITY } from './unsupportedContent/UNSUPPORTED_CONTENT_LEVEL_SEVERITY';
export { UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS } from './unsupportedContent/UNSUPPORTED_CONTENT_LEVEL_SEVERITY_THRESHOLD_DEFAULTS';
export {
	getUnsupportedContentLevelData,
	type UnsupportedContentLevelsTracking,
} from './unsupportedContent/get-unsupported-content-level-data';
export type {
	UnsupportedContentTooltipPayload,
	UnsupportedContentPayload,
} from './unsupportedContent/types';
export { findAndTrackUnsupportedContentNodes } from './track-unsupported-content';
export {
	/**
	 * @private
	 * @deprecated
	 *
	 * Please use `@atlaskit/editor-common/performance/measure-render` entry-point instead.
	 */
	getDistortedDurationMonitor,
	/**
	 * @private
	 * @deprecated
	 *
	 * Please use `@atlaskit/editor-common/performance/measure-render` entry-point instead.
	 */
	measureRender,
} from './performance/measure-render';
export { startMeasure, stopMeasure, clearMeasure } from './performance/measure';
export { TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS } from './performance/TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS';
export { TTI_SEVERITY_THRESHOLD_DEFAULTS } from './performance/TTI_SEVERITY_THRESHOLD_DEFAULTS';
export { measureTTI, getTTISeverity } from './performance/measure-tti';
/**
 * @private
 * @deprecated
 *
 * Private API - should not be used. Use `@atlaskit/editor-common/is-performance-api-available` if required.
 *
 */
export { isPerformanceAPIAvailable } from './performance/is-performance-api-available';
export { isPerformanceObserverAvailable } from './performance/isPerformanceObserverAvailable';
/**
 * @private
 * @deprecated
 *
 * Private API - should not be used. Use `@atlaskit/editor-common/performance/navigation` if required.
 */
export { getRequestToResponseTime } from './performance/getRequestToResponseTime';
export { getResponseEndTime } from './performance/getResponseEndTime';
export { getExtensionRenderer } from './extension-handler';

export { convertProsemirrorTableNodeToArrayOfRows } from './convertProsemirrorTableNodeToArrayOfRows';
export { hasMergedCell } from './hasMergedCell';
export { isPositionNearTableRow } from './isPositionNearTableRow';
export { getColumnWidths, calcTableColumnWidths } from './table';
export { createCompareNodes } from './compareNodes';
export { compose } from './compose';
export { isTextInput } from './is-text-input';
// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required -- Ignored via go/ED-25883
/**
 * @deprecated - [ED-23844] moving to own entry point @atlaskit/editor-common/whitespace
 */
export { ZERO_WIDTH_SPACE, ZERO_WIDTH_JOINER } from '../whitespace';
export type { Diff } from './types';
export { shouldForceTracking } from './should-force-tracking';
export { getModeFromTheme } from './getModeFromTheme';
export { getPerformanceOptions, stopMeasureReactNodeViewRendered } from './get-performance-options';
export { startMeasureReactNodeViewRendered } from './startMeasureReactNodeViewRendered';
export type { UserBrowserExtensionResults } from './browser-extensions';
export { sniffUserBrowserExtensions } from './browser-extensions';
export { RenderCountProfiler, PROFILER_KEY } from './profiler/render-count';
export { validateADFEntity, validationErrorHandler } from './validate-using-spec';
export { getShallowPropsDifference, getPropsDifference } from './compare-props';
export type { ShallowPropsDifference, PropsDifference } from './compare-props';
export {
	/**
	 * @private
	 * @deprecated
	 *
	 * Private API do not use - if you really need it use `@atlaskit/editor-common/use-component-render-tracking`;
	 */
	useComponentRenderTracking,
} from './performance/hooks/use-component-render-tracking';
export type { UseComponentRenderTrackingArgs } from './performance/hooks/use-component-render-tracking';
/**
 * @private
 * @deprecated
 *
 * Private API do not use
 */
export { autoJoinTr } from './prosemirror/autojoin';

export { getNodeName } from './getNodeName';
export { isReferencedSource, removeConnectedNodes, getChildrenInfo } from './referentiality';

export { isBulletList } from './isBulletList';
export { isListItemNode } from './isListItemNode';
export { isListNode } from './isListNode';
export { isParagraphNode } from './isParagraphNode';
export { getItemCounterDigitsSize, getOrderFromOrderedListNode } from './list';
export { resolveOrder } from './resolveOrder';

export { FILEPATH_REGEXP } from './FILEPATH_REGEXP';
export { LinkMatcher } from './LinkMatcher';
export { canLinkBeCreatedInRange } from './canLinkBeCreatedInRange';
export { getLinkDomain } from './getLinkDomain';
export {
	isFromCurrentDomain,
	linkifyContent,
	findFilepaths,
	isLinkInMatches,
	DONTLINKIFY_REGEXP,
	getLinkCreationAnalyticsEvent,
} from './hyperlink';
export { normalizeUrl } from './normalizeUrl';

// prosemirror-history does not export its plugin key
export const pmHistoryPluginKey = 'history$';
export { gridTypeForLayout } from './grid';

/**
 * @private
 * @deprecated
 *
 * Use `@atlaskit/editor-common/utils/document` entry-point instead.
 */
export { nodesBetweenChanged, bracketTyped, getChangedNodes } from './document';
export { getStepRange } from './getStepRange';
export { hasDocAsParent } from './hasDocAsParent';
export { hasVisibleContent } from './hasVisibleContent';
export { isEmptyDocument } from './isEmptyDocument';
export { isSelectionEndOfParagraph } from './isSelectionEndOfParagraph';

/**
 * @private
 * @deprecated
 *
 * Use `@atlaskit/editor-common/process-raw-value` entry-point instead.
 */
export { processRawValue } from './processRawValue';

export { calculateSnapPoints } from './calculateSnapPoints';
export { floatingLayouts } from './floatingLayouts';
export { isRichMediaInsideOfBlockNode } from './isRichMediaInsideOfBlockNode';
export { nonWrappedLayouts } from './nonWrappedLayouts';
export { alignAttributes } from './rich-media-utils';

export { sanitizeNodeForPrivacy } from './filter/privacy-filter';

export { canRenderDatasource } from './datasource';
export { getDatasourceType } from './getDatasourceType';
export {
	filterCommand,
	isEmptySelectionAtStart,
	isEmptySelectionAtEnd,
	deleteEmptyParagraphAndMoveBlockUp,
	insertNewLineWithAnalytics,
	createNewParagraphAbove,
	createNewParagraphBelow,
	createParagraphNear,
	walkNextNode,
	walkPrevNode,
} from './commands';
export { insertContentDeleteRange } from './insertContentDeleteRange';
export type { WalkNode } from './commands';

export { GUTTER_SELECTOR, GUTTER_SIZE_IN_PX, GUTTER_SIZE_MOBILE_IN_PX } from './scroll-gutter';

/**
 * @private
 * @deprecated
 *
 * Private API - do not use.
 */
export { getTimeSince } from './performance/get-performance-timing';

export { countNodes } from './count-nodes';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shallowEqual(obj1: any = {}, obj2: any = {}): boolean {
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	return (
		keys1.length === keys2.length &&
		keys1.reduce((acc, key) => acc && obj1[key] === obj2[key], true)
	);
}

export { createRule } from './createRule';
export { inputRuleWithAnalytics, createWrappingJoinRule } from './input-rules';

export function isSelectionInsideLastNodeInDocument(selection: Selection): boolean {
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

export const insideTableCell = (state: EditorState): boolean => {
	const { tableCell, tableHeader } = state.schema.nodes;
	return hasParentNodeOfType([tableCell, tableHeader])(state.selection);
};

/**
 * Traverse the document until an "ancestor" is found. Any nestable block can be an ancestor.
 */
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const isEmptyNode = (schema: Schema): ((node: PMNode) => boolean) => {
	const {
		doc,
		paragraph,
		expand,
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
			case expand:
			case blockquote:
			case panel:
			case listItem:
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return node.content.size === 2 && innerIsEmptyNode(node.content.firstChild!);
			case bulletList:
			case orderedList:
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return node.content.size === 4 && innerIsEmptyNode(node.content.firstChild!);
			case taskList:
			case decisionList:
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return node.content.size === 2 && innerIsEmptyNode(node.content.firstChild!);
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

	if (!node || !node.childCount || (node.childCount === 1 && isEmptyParagraph(node.firstChild))) {
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
					!(childNode.childCount === 1 && isEmptyParagraph(childNode.firstChild))) ||
				childNode.isAtom,
		).length
	);
}

export function isInEmptyLine(state: EditorState): boolean {
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

export {
	createWrapSelectionTransaction,
	getWrappingOptions,
} from './create-wrap-selection-transaction';
export { transformNodeIntoListItem } from './insert-node-into-ordered-list';

export { wrapSelectionIn } from './wrap-selection-in';

export { toJSON, nodeToJSON } from './nodes';

export {
	calculateToolbarPositionAboveSelection,
	calculateToolbarPositionOnCellSelection,
	calculateToolbarPositionTrackHead,
} from './calculate-toolbar-position';

export { findNodePosByLocalIds } from './nodes-by-localIds';

export { getPageElementCounts } from './page-element-counts';
export type { PageElementCounts } from './page-element-counts';

export { withFeatureFlaggedComponent } from './withFeatureFlaggedComponent';
