// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import isEqual from 'lodash/isEqual';
import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { type Change, ChangeSet, simplifyChanges } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction, EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Step as ProseMirrorStep, StepMap } from '@atlaskit/editor-prosemirror/transform';
import { type Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type {
	ColorScheme,
	DeletedDiffPlacement,
	DiffDescriptor,
	DiffType,
	InlineDeletedDiffPlacement,
	ShowDiffPlugin,
	SmartDiffThresholds,
} from '../../showDiffPluginType';
import { areDocsEqualByBlockStructureAndText } from '../areDocsEqualByBlockStructureAndText';
import { createDocMarginAnchorWidget } from '../decorations/createAnchorDecorationWidgets';
import { createBlockChangedDecoration } from '../decorations/createBlockChangedDecoration';
import { createGranularBlockReferenceWidget } from '../decorations/createGranularBlockReferenceWidget';
import { createInlineChangedDecoration } from '../decorations/createInlineChangedDecoration';
import { createNodeChangedDecorationWidget } from '../decorations/createNodeChangedDecorationWidget';
import { extractDiffDescriptors } from '../decorations/decorationKeys';
import {
	getAttrChangeRanges,
	stepIsValidAttrChange,
} from '../decorations/utils/getAttrChangeRanges';
import { getMarkChangeRanges } from '../decorations/utils/getMarkChangeRanges';
import { isExtendedEnabled } from '../isExtendedEnabled';
import type { ShowDiffPluginState } from '../main';
import type { NodeViewSerializer } from '../NodeViewSerializer';

import { diffBySteps, getStepChanges } from './diffBySteps';
import { groupChangesByBlock } from './groupChangesByBlock';
import { optimizeChanges } from './optimizeChanges';
import { simplifySteps } from './simplifySteps';
import { classifySmartChanges } from './smart/classifySmartChanges';
import { smartChangeLevel } from './smart/helpers';

type CalculatedDiffs = {
	decorations: DecorationSet;
	diffDescriptors: DiffDescriptor[];
};

const getChanges = ({
	changeset,
	originalDoc,
	steppedDoc,
	diffType,
	tr,
	steps,
	intl,
	smartThresholds,
}: {
	changeset: ChangeSet;
	diffType: DiffType;
	intl: IntlShape;
	originalDoc: PMNode;
	smartThresholds?: Partial<SmartDiffThresholds>;
	steppedDoc: PMNode;
	steps: ProseMirrorStep[];
	tr: Transaction;
}): Change[] => {
	if (isExtendedEnabled(diffType)) {
		// The `smart` diff type is gated behind `platform_editor_ai_smart_diff`. When the gate is
		// off, `smart` falls through to the default (`inline`) path below so behaviour degrades
		// gracefully (see docs/smart-diff-design.md §3).
		if (diffType === 'smart' && fg('platform_editor_ai_smart_diff')) {
			const changes = simplifyChanges(changeset.changes, tr.doc);
			return classifySmartChanges({
				changes,
				originalDoc,
				newDoc: tr.doc,
				locale: intl.locale,
				thresholds: smartThresholds,
			});
		}
		if (diffType === 'step') {
			return diffBySteps(originalDoc, steps);
		}
		if (diffType === 'block') {
			return groupChangesByBlock(changeset.changes, originalDoc, steppedDoc);
		}
		const changes = simplifyChanges(changeset.changes, tr.doc);
		return optimizeChanges(changes);
	}

	const changes = simplifyChanges(changeset.changes, tr.doc);
	return optimizeChanges(changes);
};

/**
 * Collect the inline-content ranges of every leaf text-bearing block (paragraph, heading, …)
 * whose content overlaps `[from, to)`. Used to clip a node-level `smart` insertion highlight to
 * the actual added text, so the inserted background/underline never spans structural gaps
 * (list markers, empty item slots, cell/column boundaries) which would render as phantom rows.
 */
const leafTextblockRanges = (
	doc: EditorState['doc'],
	from: number,
	to: number,
): Array<[number, number]> => {
	const ranges: Array<[number, number]> = [];
	doc.nodesBetween(from, to, (node, pos) => {
		if (node.isTextblock && node.content.size > 0) {
			const contentFrom = Math.max(pos + 1, from);
			const contentTo = Math.min(pos + 1 + node.content.size, to);
			if (contentTo > contentFrom) {
				ranges.push([contentFrom, contentTo]);
			}
			// Textblocks have no block children to descend into.
			return false;
		}
		return true;
	});
	return ranges;
};

const calculateNodesForBlockDecoration = ({
	doc,
	from,
	to,
	colorScheme,
	isInserted = true,
	activeIndexPos,
	shouldHideDeleted = false,
	showIndicators = false,
	diffType,
}: {
	activeIndexPos?: { from: number; to: number };
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	doc: EditorState['doc'];
	from: number;
	intl: IntlShape;
	isInserted?: boolean;
	shouldHideDeleted?: boolean;
	showIndicators?: boolean;
	to: number;
}): Decoration[] => {
	const decorations: Decoration[] = [];
	// Iterate over the document nodes within the range
	doc.nodesBetween(from, to, (node, pos) => {
		if (node.isBlock && (!isExtendedEnabled(diffType) || pos + node.nodeSize <= to)) {
			const nodeEnd = pos + node.nodeSize;
			const isActive =
				activeIndexPos && pos === activeIndexPos.from && nodeEnd === activeIndexPos.to;

			decorations.push(
				...createBlockChangedDecoration({
					change: { from: pos, to: nodeEnd, name: node.type.name },
					colorScheme,
					isInserted,
					isActive,
					shouldHideDeleted,
					showIndicators,
					doc,
					diffType,
				}),
			);
		}
	});

	return decorations;
};

type NodesEqualEvent = {
	action: 'nodesNotEqual';
	actionSubject: 'showDiff';
	attributes: {
		colorScheme: ColorScheme | undefined;
		docSizeEqual: boolean;
		recoveredViaContentEquality?: boolean;
	};
	eventType: 'track';
};

const calculateDiffDecorationsInner = ({
	state,
	pluginState,
	nodeViewSerializer,
	colorScheme,
	intl,
	activeIndexPos,
	api,
	isInverted = false,
	diffType = 'inline',
	hideDeletedDiffs = false,
	hideAddedDiffsUnderline: hideAddedDiffsUnderlineParam = false,
	showIndicators = false,
	smartThresholds,
	deletedDiffPlacement = 'top',
	inlineDeletedDiffPlacement = 'before',
}: {
	activeIndexPos?: { from: number; to: number };
	api: ExtractInjectionAPI<ShowDiffPlugin> | undefined;
	colorScheme?: ColorScheme;
	deletedDiffPlacement?: DeletedDiffPlacement;
	diffType?: DiffType;
	hideAddedDiffsUnderline?: boolean;
	hideDeletedDiffs?: boolean;
	inlineDeletedDiffPlacement?: InlineDeletedDiffPlacement;
	intl: IntlShape;
	isInverted?: boolean;
	nodeViewSerializer: NodeViewSerializer;
	pluginState: Omit<ShowDiffPluginState, 'decorations'>;
	showIndicators?: boolean;
	smartThresholds?: Partial<SmartDiffThresholds>;
	state: EditorState;
}): CalculatedDiffs => {
	const { originalDoc, steps, isDisplayingChanges } = pluginState;
	if (!originalDoc || !isDisplayingChanges) {
		return { decorations: DecorationSet.empty, diffDescriptors: [] };
	}

	// Resolve the option against its gate once here, so every downstream inline/block builder
	// receives the same value. When the gate is off the option is a no-op.
	const hideAddedDiffsUnderline =
		hideAddedDiffsUnderlineParam && fg('platform_editor_ai_smart_diff');

	const { tr } = state;
	let steppedDoc = originalDoc;

	const attrSteps: ProseMirrorStep[] = [];
	const simplifiedSteps = simplifySteps(steps, originalDoc);
	const stepMaps: StepMap[] = [];

	for (const step of simplifiedSteps) {
		const result = step.apply(steppedDoc);
		if (result.failed === null && result.doc) {
			if (stepIsValidAttrChange(step, steppedDoc, result.doc)) {
				attrSteps.push(step);
			}
			stepMaps.push(step.getMap());
			steppedDoc = result.doc;
		}
	}

	// Rather than using .eq() we use a custom function that only checks for structural
	// changes and ignores differences in attributes which don't affect decoration positions
	if (!areNodesEqualIgnoreAttrs(steppedDoc, tr.doc)) {
		const recoveredViaContentEquality = areDocsEqualByBlockStructureAndText(steppedDoc, tr.doc);

		api?.analytics?.actions.fireAnalyticsEvent<NodesEqualEvent, 'customEventType'>({
			eventType: 'track',
			action: 'nodesNotEqual',
			actionSubject: 'showDiff',
			attributes: {
				docSizeEqual: steppedDoc.nodeSize === tr.doc.nodeSize,
				colorScheme,
				recoveredViaContentEquality,
			},
		});

		if (!recoveredViaContentEquality) {
			return { decorations: DecorationSet.empty, diffDescriptors: [] };
		}
	}
	const changeset = ChangeSet.create(originalDoc).addSteps(steppedDoc, stepMaps, tr.doc);
	const changes = getChanges({
		changeset,
		originalDoc,
		steppedDoc,
		diffType,
		tr,
		steps,
		intl,
		smartThresholds,
	});

	const decorations: Decoration[] = [];

	/**
	 * If showIndicators is on, we create an anchor widget here to mark the doc margin.
	 */
	if (showIndicators && isExtendedEnabled(diffType)) {
		decorations.push(createDocMarginAnchorWidget());
	}

	// Our default operations are insertions, so it should match the opposite of isInverted.
	const isInserted = !isInverted;

	const createDecorationsForChange = (change: Change, showGranularWithBlock: boolean): void => {
		const isActive =
			activeIndexPos && change.fromB === activeIndexPos.from && change.toB === activeIndexPos.to;

		if (change.inserted.length > 0) {
			// shouldHideDeleted for block/node decorations: suppressed when isInverted + hideDeletedDiffs,
			// or when showGranularWithBlock (block reference widget is shown instead).
			// isInverted gates both — on an inverted diff the inserted side is visually the deleted side.
			const shouldHideDeleted = isExtendedEnabled(diffType)
				? isInverted && (hideDeletedDiffs || (showGranularWithBlock && change.deleted.length > 0))
				: false;

			// For `smart` NODE-level promotions the change range spans a whole container
			// (e.g. an entire list/table/layout, using outer node bounds). Applying a SINGLE
			// inline decoration across that whole range would paint the inserted style across
			// block boundaries and structural gaps (list markers, empty item slots), producing
			// phantom "empty" rows above the real content. But skipping the inline highlight
			// entirely leaves added text-bearing blocks (paragraphs/headings inside the added
			// container) without the inserted background+underline, because block decorations
			// return no style for paragraph/heading. So for node-level smart changes we instead
			// emit ONE inline decoration per leaf text-bearing block within the range — the text
			// gets highlighted, and structural gaps never do.
			const isSmartNodeLevel =
				diffType === 'smart' &&
				fg('platform_editor_ai_smart_diff') &&
				smartChangeLevel(change) === 'node';
			if (isSmartNodeLevel) {
				for (const [from, to] of leafTextblockRanges(tr.doc, change.fromB, change.toB)) {
					decorations.push(
						...createInlineChangedDecoration({
							change: { fromB: from, toB: to },
							doc: tr.doc,
							colorScheme,
							isActive,
							diffType,
							...(isExtendedEnabled(diffType) && {
								isInserted,
								shouldHideDeleted,
								showIndicators,
								hideAddedDiffsUnderline,
							}),
						}),
					);
				}
			} else {
				decorations.push(
					...createInlineChangedDecoration({
						change,
						doc: tr.doc,
						colorScheme,
						isActive,
						diffType,
						...(isExtendedEnabled(diffType) && {
							isInserted,
							shouldHideDeleted,
							showIndicators,
							hideAddedDiffsUnderline,
						}),
					}),
				);
			}

			decorations.push(
				...calculateNodesForBlockDecoration({
					doc: tr.doc,
					from: change.fromB,
					to: change.toB,
					colorScheme,
					...(isExtendedEnabled(diffType) && {
						isInserted,
						shouldHideDeleted,
						showIndicators,
					}),
					activeIndexPos,
					intl,
					diffType,
				}),
			);
		}
		if (change.deleted.length > 0) {
			const shouldHideDeleted = isExtendedEnabled(diffType)
				? !isInverted && (hideDeletedDiffs || showGranularWithBlock) && change.inserted.length > 0
				: false;
			if (!shouldHideDeleted) {
				decorations.push(
					...createNodeChangedDecorationWidget({
						change,
						doc: originalDoc,
						nodeViewSerializer,
						colorScheme,
						newDoc: tr.doc,
						intl,
						activeIndexPos,
						...(isExtendedEnabled(diffType) && {
							isInserted: !isInserted,
							diffType,
							hideAddedDiffsUnderline,
							// For `smart` changes, optionally render the deleted content after the new
							// content (gray + strikethrough) instead of before it. Two independent
							// controls, split by change level:
							// - node/paragraph-level: `deletedDiffPlacement` (default `'top'`).
							// - inline/sentence-level: `inlineDeletedDiffPlacement` (default `'before'`).
							placeBelow:
								diffType === 'smart' &&
								fg('platform_editor_ai_smart_diff') &&
								(() => {
									const level = smartChangeLevel(change);
									if (level === 'node' || level === 'paragraph') {
										return deletedDiffPlacement === 'bottom';
									}
									// Inline-level (undefined) and sentence-level changes.
									return inlineDeletedDiffPlacement === 'after';
								})(),
						}),
						showIndicators,
					}),
				);
			}
		}
	};

	if (
		diffType === 'step' &&
		expValEquals('platform_editor_diff_granular_extended', 'isEnabled', true)
	) {
		// Uses getStepChanges instead of getChanges so that we have per-step granularity metadata.
		// Specifically, we need to know how many granular changes each step produced in order to
		// apply the shouldHideDeleted suppression threshold (> 3 granular changes per step).
		// getChanges returns a flat Change[] with no per-step grouping, making this count impossible
		// to derive after the fact without re-introducing per-change metadata.
		const stepChanges = getStepChanges(originalDoc, steps);
		stepChanges.forEach(({ isGranular, changes: stepChangeList }) => {
			const granularCount = isGranular ? stepChangeList.length : 0;

			// Calculate the average ratio of changed content on both A (original) and B (new)
			// sides of the diff. If 30% or more of the block has changed on average, we show
			// the block reference widget even if the granular change count is below the threshold.
			// Block length is derived from the enclosing text block boundaries rather than the
			// first/last change positions, so unchanged words at the start/end are accounted for.
			let avgChangedRatio = 0;
			if (isGranular && stepChangeList.length > 0) {
				const first = stepChangeList[0];
				const last = stepChangeList[stepChangeList.length - 1];

				const resolvedA = originalDoc.resolve(first.fromA);
				const resolvedB = tr.doc.resolve(first.fromB);
				let blockStartA = first.fromA;
				let blockEndA = last.toA;
				let blockStartB = first.fromB;
				let blockEndB = last.toB;
				for (let depth = resolvedA.depth; depth >= 0; depth--) {
					const node = resolvedA.node(depth);
					if (node.isTextblock) {
						blockStartA = resolvedA.start(depth);
						blockEndA = blockStartA + node.nodeSize - 2; // exclude open/close tokens
						break;
					}
				}
				for (let depth = resolvedB.depth; depth >= 0; depth--) {
					const node = resolvedB.node(depth);
					if (node.isTextblock) {
						blockStartB = resolvedB.start(depth);
						blockEndB = blockStartB + node.nodeSize - 2; // exclude open/close tokens
						break;
					}
				}

				const blockLengthA = blockEndA - blockStartA;
				const blockLengthB = blockEndB - blockStartB;
				const totalChangedA = stepChangeList.reduce((sum, c) => sum + (c.toA - c.fromA), 0);
				const totalChangedB = stepChangeList.reduce((sum, c) => sum + (c.toB - c.fromB), 0);
				const ratioA = blockLengthA > 0 ? totalChangedA / blockLengthA : 0;
				const ratioB = blockLengthB > 0 ? totalChangedB / blockLengthB : 0;
				avgChangedRatio = (ratioA + ratioB) / 2;
			}

			const showGranularWithBlock =
				isGranular && granularCount !== 1 && (granularCount > 3 || avgChangedRatio >= 0.3);
			stepChangeList.forEach((change) => {
				createDecorationsForChange(change, showGranularWithBlock);
			});
			if (showGranularWithBlock && stepChangeList.length > 0 && !hideDeletedDiffs) {
				const lastChange = stepChangeList[stepChangeList.length - 1];
				const granularBlockDiffId = crypto.randomUUID();
				const blockWidgets = createGranularBlockReferenceWidget({
					change: lastChange,
					originalDoc,
					newDoc: tr.doc,
					isInverted,
					nodeViewSerializer,
					colorScheme,
					intl,
					activeIndexPos,
					diffId: granularBlockDiffId,
					showIndicators,
				});
				decorations.push(...blockWidgets);
			}
		});
	} else {
		changes.forEach((change) => {
			createDecorationsForChange(change, /* showGranularWithBlock */ false);
		});
	}
	getMarkChangeRanges(steps).forEach((change) => {
		const isActive =
			activeIndexPos && change.fromB === activeIndexPos.from && change.toB === activeIndexPos.to;
		decorations.push(
			...createInlineChangedDecoration({
				change,
				colorScheme,
				isActive,
				isInserted: true,
			}),
		);
	});
	getAttrChangeRanges(tr.doc, attrSteps, originalDoc).forEach((change) => {
		if (change.isInline) {
			// Inline nodes (e.g. date, emoji, mention, status) need an inline decoration rather than a block decoration
			const isActive =
				activeIndexPos && change.fromB === activeIndexPos.from && change.toB === activeIndexPos.to;
			const isAtomicInlineNodeFlag = expValEquals(
				'platform_editor_improve_inline_diffs',
				'isEnabled',
				true,
			);
			decorations.push(
				...createInlineChangedDecoration({
					change,
					colorScheme,
					isActive,
					isInserted: true,
					isAtomicInlineNode: isAtomicInlineNodeFlag,
					inlineNodeName: change.inlineNodeName,
					// Suppress the border-bottom underline for atomic inline nodeviews —
					// it doesn't render on custom nodeview DOM elements and is unnecessary noise.
					hideAddedDiffsUnderline: isAtomicInlineNodeFlag,
					diffType,
				}),
			);
			// If we have the original node position, also render the old node as a "deleted" widget
			// so the user can see what it looked like before the change.
			if (
				change.fromA !== undefined &&
				change.toA !== undefined &&
				expValEquals('platform_editor_improve_inline_diffs', 'isEnabled', true)
			) {
				decorations.push(
					...createNodeChangedDecorationWidget({
						change: {
							fromA: change.fromA,
							toA: change.toA,
							fromB: change.fromB,
							toB: change.toB,
							deleted: [],
						},
						doc: originalDoc,
						nodeViewSerializer,
						colorScheme,
						newDoc: tr.doc,
						intl,
						activeIndexPos,
						isInserted: false,
					}),
				);
			}
		} else {
			decorations.push(
				...calculateNodesForBlockDecoration({
					doc: tr.doc,
					from: change.fromB,
					to: change.toB,
					colorScheme,
					isInserted: true,
					activeIndexPos,
					intl,
					showIndicators,
				}),
			);
		}
	});

	const decorationSet = DecorationSet.empty.add(tr.doc, decorations);

	return {
		decorations: decorationSet,
		diffDescriptors: extractDiffDescriptors(decorationSet),
	};
};

export const calculateDiffDecorations: MemoizedFn<
	({
		state,
		pluginState,
		nodeViewSerializer,
		colorScheme,
		intl,
		activeIndexPos,
		api,
		hideDeletedDiffs,
		hideAddedDiffsUnderline,
		showIndicators,
	}: {
		activeIndexPos?: {
			from: number;
			to: number;
		};
		api: ExtractInjectionAPI<ShowDiffPlugin> | undefined;
		colorScheme?: ColorScheme;
		deletedDiffPlacement?: DeletedDiffPlacement;
		hideAddedDiffsUnderline?: boolean;
		hideDeletedDiffs?: boolean;
		inlineDeletedDiffPlacement?: InlineDeletedDiffPlacement;
		intl: IntlShape;
		nodeViewSerializer: NodeViewSerializer;
		pluginState: Omit<ShowDiffPluginState, 'decorations'>;
		showIndicators?: boolean;
		smartThresholds?: Partial<SmartDiffThresholds>;
		state: EditorState;
	}) => CalculatedDiffs
> = memoizeOne(
	calculateDiffDecorationsInner,
	// Cache results unless relevant inputs change
	(
		[
			{
				pluginState,
				state,
				colorScheme,
				intl,
				activeIndexPos,
				isInverted,
				diffType,
				hideDeletedDiffs,
				hideAddedDiffsUnderline,
				showIndicators,
				smartThresholds,
				deletedDiffPlacement,
				inlineDeletedDiffPlacement,
			},
		],
		[
			{
				pluginState: lastPluginState,
				state: lastState,
				colorScheme: lastColorScheme,
				intl: lastIntl,
				activeIndexPos: lastActiveIndexPos,
				isInverted: lastIsInverted,
				diffType: lastDiffType,
				hideDeletedDiffs: lastHideDeletedDiffs,
				hideAddedDiffsUnderline: lastHideAddedDiffsUnderline,
				showIndicators: lastShowIndicators,
				smartThresholds: lastSmartThresholds,
				deletedDiffPlacement: lastDeletedDiffPlacement,
				inlineDeletedDiffPlacement: lastInlineDeletedDiffPlacement,
			},
		],
	) => {
		const originalDocIsSame =
			lastPluginState.originalDoc &&
			pluginState.originalDoc &&
			pluginState.originalDoc.eq(lastPluginState.originalDoc);

		if (isExtendedEnabled(diffType)) {
			return (
				(colorScheme === lastColorScheme &&
					intl.locale === lastIntl.locale &&
					isInverted === lastIsInverted &&
					diffType === lastDiffType &&
					isEqual(activeIndexPos, lastActiveIndexPos) &&
					originalDocIsSame &&
					isEqual(pluginState.steps, lastPluginState.steps) &&
					state.doc.eq(lastState.doc) &&
					hideDeletedDiffs === lastHideDeletedDiffs &&
					hideAddedDiffsUnderline === lastHideAddedDiffsUnderline &&
					showIndicators === lastShowIndicators &&
					isEqual(smartThresholds, lastSmartThresholds) &&
					deletedDiffPlacement === lastDeletedDiffPlacement &&
					inlineDeletedDiffPlacement === lastInlineDeletedDiffPlacement) ??
				false
			);
		}
		return (
			(originalDocIsSame &&
				isEqual(pluginState.steps, lastPluginState.steps) &&
				state.doc.eq(lastState.doc) &&
				colorScheme === lastColorScheme &&
				intl.locale === lastIntl.locale &&
				isEqual(activeIndexPos, lastActiveIndexPos) &&
				hideDeletedDiffs === lastHideDeletedDiffs) ??
			false
		);
	},
);
