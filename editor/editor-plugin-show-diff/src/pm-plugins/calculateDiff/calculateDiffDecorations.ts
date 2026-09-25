import isEqual from 'lodash/isEqual';
import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { type Change, ChangeSet, simplifyChanges } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { areDocsEqualByBlockStructureAndText } from '@atlaskit/editor-common/utils/areDocsEqualByBlockStructureAndText';
import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction, EditorState } from '@atlaskit/editor-prosemirror/state';
import { Mapping, type StepMap } from '@atlaskit/editor-prosemirror/transform';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform-override';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type {
	ColorScheme,
	ContributorTagModel,
	DeletedDiffPlacement,
	DiffDescriptor,
	DiffType,
	InlineDeletedDiffPlacement,
	RevealOptions,
	ShowDiffPlugin,
	SmartDiffThresholds,
} from '../../showDiffPluginType';
import {
	createAttributionColorMap,
	type DiffAttributionSpanData,
	getAttributionKey,
	getAttributionKeyForChange,
	getColorSchemeForChange,
	isAttributionColoringEnabled,
	isContributorTagsEnabled,
} from '../decorations/colorSchemes/attributions';
import type { ColorScheme as DecorationColorScheme } from '../decorations/colorSchemes/types';
import { createDocMarginAnchorWidget } from '../decorations/createAnchorDecorationWidgets';
import { createBlockChangedDecoration } from '../decorations/createBlockChangedDecoration';
import type { ContributorTagMountContext } from '../decorations/createContributorTagWidget';
import { createInlineChangedDecoration } from '../decorations/createInlineChangedDecoration';
import { createNodeChangedDecorationWidget } from '../decorations/createNodeChangedDecorationWidget';
import { extractDiffDescriptors } from '../decorations/decorationKeys';
import { extractContributorTags } from '../decorations/extractContributorTags';
import { createDeletedLineBreakDecoration } from '../decorations/utils/createDeletedLineBreakWidget';
import {
	type AttrStepContext,
	getAttrChangeRanges,
	stepIsValidAttrChange,
} from '../decorations/utils/getAttrChangeRanges';
import { getMarkChangeRanges } from '../decorations/utils/getMarkChangeRanges';
import { createRemovedLozenge } from '../decorations/utils/wrapBlockNodeView';
import { getDefaultDiffType } from '../getDefaultDiffType';
import { getScrollableDecorations } from '../getScrollableDecorations';
import type { ShowDiffPluginState } from '../main';
import type { NodeViewSerializer } from '../NodeViewSerializer';
import { emptyTextBlockContentPositions } from '../utils/emptyTextBlocks';
import { diffBySteps } from './diffBySteps';
import { groupChangesByBlock } from './groupChangesByBlock';
import {
	CELL_CONTENT_OFFSET,
	type ColumnAwareChange,
	groupDeletedColumnChanges,
} from './groupDeletedColumnChanges';
import { isMarkOnlyChange } from './isMarkOnlyChange';
import { isOpenTokenOnlyChange } from './isOpenTokenOnlyChange';
import { optimizeChanges } from './optimizeChanges';
import { selectTokenEncoder } from './selectTokenEncoder';
import {
	type AttributedChange,
	collapseOverlappingChanges,
	simplifyChangesWithAttribution,
} from './simplifyChangesWithAttribution';

type AttributedColumnAwareChange = AttributedChange & ColumnAwareChange;
import { simplifySteps, simplifyStepsWithAttribution } from './simplifySteps';
import { classifySmartChanges } from './smart/classifySmartChanges';
import { smartChangeLevel } from './smart/helpers';

type CalculatedDiffs = {
	/** Resolved here, not in React, so the attribution keys and contributor lookup stay internal. */
	contributorTags: ContributorTagModel[];
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
};

const getAttributedChanges = ({
	attributedChanges,
	changeset,
	originalDoc,
	steppedDoc,
	diffType,
	tr,
}: {
	attributedChanges: Change[];
	changeset: ChangeSet;
	diffType: DiffType;
	originalDoc: PMNode;
	steppedDoc: PMNode;
	tr: Transaction;
}): Change[] => {
	// `smart` is deliberately absent here, even though `getChanges` applies it: the classifier drops
	// the step attribution and promotes ranges to sentence/paragraph/node granularity, so a promoted
	// range covers several actors' steps and the latest-writer rule credits all of it to one of them.
	// The attributed changeset keeps step granularity instead.
	if (diffType === 'step') {
		return attributedChanges;
	}
	if (diffType === 'block') {
		return groupChangesByBlock(changeset.changes, originalDoc, steppedDoc);
	}

	return simplifyChangesWithAttribution(attributedChanges, tr.doc);
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

// A large inserted table is treated with a coarse decoration path (see below)
// once it has more leaf textblocks (~cells) than this threshold. Small tables
// keep the precise per-cell path.
const LARGE_TABLE_LEAF_THRESHOLD = 40;

/**
 * An active scrollable change may contain several underlying diff changes. Treat ranges that
 * overlap or touch the active range as part of the same active customer-facing edit.
 */
const isRangeActive = (
	activeIndexPos: { from: number; to: number } | undefined,
	from: number,
	to: number,
): boolean | undefined => {
	if (activeIndexPos === undefined) {
		return undefined;
	}
	if (!fg('confluence_ncs_step_diffing_version_history')) {
		return from === activeIndexPos.from && to === activeIndexPos.to;
	}
	return from <= activeIndexPos.to && activeIndexPos.from <= to;
};

const isLargeInsertedTableRange = (doc: EditorState['doc'], from: number, to: number): boolean => {
	let containsTable = false;
	let leafCount = 0;
	doc.nodesBetween(from, to, (node) => {
		if (node.type.name === 'table') {
			containsTable = true;
		}
		if (node.isTextblock) {
			leafCount += 1;
			return false;
		}
		return true;
	});
	return containsTable && leafCount > LARGE_TABLE_LEAF_THRESHOLD;
};

// Collect the [from, to) ranges of every `table` node overlapping `[from, to)`. The coarse
// large-table path must only suppress decorations inside these ranges
const tableRanges = (
	doc: EditorState['doc'],
	from: number,
	to: number,
): Array<[number, number]> => {
	const ranges: Array<[number, number]> = [];
	doc.nodesBetween(from, to, (node, pos) => {
		if (node.type.name === 'table') {
			ranges.push([pos, pos + node.nodeSize]);
			return false;
		}
		return true;
	});
	return ranges;
};

const isInsideTable = (tables: Array<[number, number]>, pos: number): boolean =>
	tables.some(([tFrom, tTo]) => pos >= tFrom && pos < tTo);

const calculateNodesForBlockDecoration = ({
	attributionKey,
	doc,
	from,
	to,
	colorScheme,
	isInserted = true,
	leftAnchorId,
	activeIndexPos,
	shouldHideDeleted = false,
	showContributorTags = false,
	showIndicators = false,
	coarseTableCellsOnly = false,
	tagMountContext,
	nodeRanges,
}: {
	activeIndexPos?: { from: number; to: number };
	attributionKey?: string;
	coarseTableCellsOnly?: boolean;
	colorScheme?: DecorationColorScheme;
	doc: EditorState['doc'];
	from: number;
	intl: IntlShape;
	isInserted?: boolean;
	leftAnchorId?: string;
	/**
	 * The exact nodes to decorate, for one piece of a split change. Given, `from`/`to` are not
	 * walked: descending a container would also claim the blocks another contributor added inside it.
	 */
	nodeRanges?: ReadonlyArray<{ from: number; to: number }>;
	shouldHideDeleted?: boolean;
	showContributorTags?: boolean;
	showIndicators?: boolean;
	tagMountContext?: ContributorTagMountContext;
	to: number;
}): Decoration[] => {
	const decorations: Decoration[] = [];

	// Exact-nodes path: only reached for a split change (EDITOR-8932), which names the nodes it
	// owns. Deliberately kept separate from the walk below rather than sharing it.
	if (nodeRanges) {
		for (const { from: pos, to: nodeEnd } of nodeRanges) {
			const node = doc.nodeAt(pos);
			if (!node?.isBlock) {
				continue;
			}
			const isActive = isRangeActive(activeIndexPos, pos, nodeEnd);

			decorations.push(
				...createBlockChangedDecoration({
					attributionKey,
					change: { from: pos, to: nodeEnd, name: node.type.name },
					colorScheme,
					isInserted,
					leftAnchorId,
					isActive,
					shouldHideDeleted,
					showContributorTags,
					showIndicators,
					doc,
					tagMountContext,
				}),
			);
		}
		return decorations;
	}

	// Coarse path: inside the large table, only cell/header overlays are kept — the
	// table/row/paragraph decorations there are redundant and cause expensive per-cell
	// re-render. Blocks outside the table keep their normal decorations.
	const coarseTables = coarseTableCellsOnly ? tableRanges(doc, from, to) : [];
	// nodesBetween visits ancestors that start before the changed range.
	// Only fully contained blocks should mark existing list bullets as new.
	const requireContainedBlocks =
		UNSAFE_expValNoExposure('platform_editor_ai_review_moment', 'isEnabled', false) === true;
	// Iterate over the document nodes within the range
	doc.nodesBetween(from, to, (node, pos) => {
		if (coarseTableCellsOnly && isInsideTable(coarseTables, pos)) {
			const name = node.type.name;
			if (name !== 'tableCell' && name !== 'tableHeader') {
				return;
			}
		}
		if (node.isBlock && (!requireContainedBlocks || pos >= from) && pos + node.nodeSize <= to) {
			const nodeEnd = pos + node.nodeSize;
			const isActive = isRangeActive(activeIndexPos, pos, nodeEnd);

			decorations.push(
				...createBlockChangedDecoration({
					attributionKey,
					change: { from: pos, to: nodeEnd, name: node.type.name },
					colorScheme,
					isInserted,
					leftAnchorId,
					isActive,
					shouldHideDeleted,
					showContributorTags,
					showIndicators,
					doc,
					tagMountContext,
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

/**
 * Whether deleted content for `change` renders after the new content instead of before it.
 *
 * show-diff splits this across two options by change granularity, so the level decides which one
 * applies:
 * - node/paragraph-level: `deletedDiffPlacement` (default `'top'`). Pure deletions are promoted to
 *   node level, so they are governed here too.
 * - inline/sentence-level: `inlineDeletedDiffPlacement` (default `'before'`).
 *
 * Callers are responsible for the `smart` diffType and gate checks.
 */
export const isDeletedContentPlacedBelow = ({
	change,
	deletedDiffPlacement,
	inlineDeletedDiffPlacement,
}: {
	change: Change;
	deletedDiffPlacement?: DeletedDiffPlacement;
	inlineDeletedDiffPlacement?: InlineDeletedDiffPlacement;
}): boolean => {
	const level = smartChangeLevel(change);

	if (level === 'node' || level === 'paragraph') {
		return deletedDiffPlacement === 'bottom';
	}

	// Inline-level (undefined) and sentence-level changes.
	return inlineDeletedDiffPlacement === 'after';
};

/**
 * Single place `platform_editor_diff_hide_pure_deletions` is read, shared by the widget-anchor
 * calculation and the decoration push below so the two cannot drift.
 *
 * The clean view ("new state") historically only suppressed a deleted side when the same change
 * also carried an insertion. A PURE deletion — text removed with nothing put in its place — fell
 * through and leaked struck-through text into a view that is supposed to show none. `smart` never
 * showed this because it pairs a rewrite into a single change that always carries an insertion;
 * `inline` emits delete-only changes, so it did.
 *
 * With the gate off this returns exactly what both callers computed before it existed.
 *
 * Umbrella experiment: within the AI streaming UX M1 population this behaviour is only enabled
 * for the treatment cohort. Non-AI callers (track-changes, etc.) are not enrolled and default
 * to `true`, preserving the pre-umbrella baseline.
 */
const shouldHideDeletedSide = ({
	change,
	hideDeletedDiffs,
	isInverted,
}: {
	change: { inserted: readonly unknown[] };
	hideDeletedDiffs?: boolean;
	isInverted?: boolean;
}): boolean =>
	!isInverted &&
	!!hideDeletedDiffs &&
	(change.inserted.length > 0 ||
		(fg('platform_editor_diff_hide_pure_deletions') &&
			UNSAFE_expValNoExposure(
				'platform_editor_ai_streaming_ux_experience_m1',
				'isEnabled',
				false,
			) === true));

const calculateDiffDecorationsInner = ({
	state,
	pluginState,
	nodeViewSerializer,
	colorScheme,
	intl,
	activeIndexPos,
	api,
	isInverted = false,
	diffType = getDefaultDiffType(),
	hideDeletedDiffs = false,
	hideAddedDiffsUnderline: hideAddedDiffsUnderlineParam = false,
	showIndicators = false,
	smartThresholds,
	deletedDiffPlacement = 'top',
	inlineDeletedDiffPlacement = 'before',
	reveal,
	tagMountContext,
}: {
	/**
	 * The range navigation is on: all of it highlights, but only the tag on the change it starts
	 * with reveals — see `extractContributorTags`.
	 */
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
	reveal?: RevealOptions;
	showIndicators?: boolean;
	smartThresholds?: Partial<SmartDiffThresholds>;
	state: EditorState;
	tagMountContext?: ContributorTagMountContext;
}): CalculatedDiffs => {
	const { originalDoc, steps, stepAttributions, contributors, isDisplayingChanges } = pluginState;
	if (!originalDoc || !isDisplayingChanges) {
		return {
			contributorTags: [],
			decorations: DecorationSet.empty,
			diffDescriptors: [],
		};
	}

	// Resolve the option against its gate once here, so every downstream inline/block builder
	// receives the same value. When the gate is off the option is a no-op.
	const hideAddedDiffsUnderline =
		hideAddedDiffsUnderlineParam && fg('platform_editor_ai_smart_diff');

	const { tr } = state;
	let steppedDoc = originalDoc;
	const attributionColoringEnabled = isAttributionColoringEnabled(stepAttributions);
	const showContributorTags = isContributorTagsEnabled(stepAttributions, contributors);
	// Tags need the attributed changeset even on diffs with too few actors to be worth colouring.
	const attributedChangesetEnabled = attributionColoringEnabled || showContributorTags;

	let simplifiedSteps: ProseMirrorStep[];
	let simplifiedStepAttributions: NonNullable<ShowDiffPluginState['stepAttributions']> = [];

	if (attributedChangesetEnabled) {
		const simplifiedStepsWithAttribution = simplifyStepsWithAttribution(
			steps,
			stepAttributions ?? [],
			originalDoc,
		);
		simplifiedSteps = simplifiedStepsWithAttribution.map(({ step }) => step);
		simplifiedStepAttributions = simplifiedStepsWithAttribution.map(
			({ stepAttribution }) => stepAttribution,
		);
	} else {
		simplifiedSteps = simplifySteps(steps, originalDoc);
	}

	const pendingAttrSteps: Array<
		Omit<AttrStepContext, 'finalPos' | 'originalPos'> & { mapIndex: number }
	> = [];
	const stepMaps: StepMap[] = [];

	for (const [stepIndex, step] of simplifiedSteps.entries()) {
		const result = step.apply(steppedDoc);
		if (result.failed === null && result.doc) {
			if (stepIsValidAttrChange(step, steppedDoc, result.doc)) {
				pendingAttrSteps.push({
					attributionKey: getAttributionKey(simplifiedStepAttributions[stepIndex]),
					afterNode: result.doc.nodeAt(step.pos),
					beforeNode: steppedDoc.nodeAt(step.pos),
					mapIndex: stepMaps.length,
					step,
				});
			}
			stepMaps.push(step.getMap());
			steppedDoc = result.doc;
		}
	}
	// Mapped positions and step-time nodes are used together so an attr change is attributed to the
	// node it actually happened on, even when later steps move it.
	const attrStepContexts = pendingAttrSteps.flatMap<AttrStepContext>(
		({ afterNode, attributionKey, beforeNode, mapIndex, step }) => {
			const finalPosition = new Mapping(stepMaps.slice(mapIndex + 1)).mapResult(step.pos);
			if (finalPosition.deleted) {
				return [];
			}

			const originalPosition = new Mapping(stepMaps.slice(0, mapIndex))
				.invert()
				.mapResult(step.pos);

			return [
				{
					attributionKey,
					afterNode,
					beforeNode,
					finalPos: finalPosition.pos,
					...(originalPosition.deleted ? {} : { originalPos: originalPosition.pos }),
					step,
				},
			];
		},
	);

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
			return { contributorTags: [], decorations: DecorationSet.empty, diffDescriptors: [] };
		}
	}
	// The attribute-aware encoder is only needed by the smart classifier and is gated with it.
	const { tokenEncoder, shouldHideMarkOnlyDeletions } = selectTokenEncoder(
		diffType === 'smart' && fg('platform_editor_ai_smart_diff'),
	);
	let changes: AttributedColumnAwareChange[];
	let attributedChanges: Change[] = [];
	let attributionColors: ReturnType<typeof createAttributionColorMap> | undefined;

	if (attributedChangesetEnabled) {
		const changeset = ChangeSet.create<DiffAttributionSpanData>(
			originalDoc,
			(left, right) =>
				getAttributionKey(left) === getAttributionKey(right)
					? left.stepIndex > right.stepIndex
						? left
						: right
					: // `prosemirror-changeset` uses null as its incompatible-data sentinel even
						// though its public combine callback is typed as returning Data.
						(null as unknown as DiffAttributionSpanData),
			tokenEncoder,
		).addSteps(
			steppedDoc,
			stepMaps,
			simplifiedStepAttributions.map((attribution, stepIndex) => ({
				...attribution,
				stepIndex,
			})),
		);
		attributedChanges =
			diffType === 'step'
				? diffBySteps(originalDoc, simplifiedSteps, simplifiedStepAttributions)
				: [...changeset.changes];
		// The attributed pipeline gives no guarantee that its output ranges are disjoint — see
		// `collapseOverlappingChanges`.
		const uncollapsedChanges = getAttributedChanges({
			changeset,
			originalDoc,
			steppedDoc,
			diffType,
			tr,
			attributedChanges,
		});
		changes = collapseOverlappingChanges(uncollapsedChanges, tr.doc);

		// Still colours-only: a tags-only diff keeps the plain colour scheme.
		if (attributionColoringEnabled) {
			attributionColors = createAttributionColorMap(simplifiedStepAttributions, contributors);
		}
	} else {
		const changeset = ChangeSet.create(originalDoc, undefined, tokenEncoder).addSteps(
			steppedDoc,
			stepMaps,
			tr.doc,
		);
		changes = getChanges({
			changeset,
			originalDoc,
			steppedDoc,
			diffType,
			tr,
			steps: simplifiedSteps,
			intl,
			smartThresholds,
		});
	}

	const decorations: Decoration[] = [];

	/**
	 * If showIndicators is on, we create an anchor widget here to mark the doc margin.
	 */
	if (showIndicators) {
		decorations.push(createDocMarginAnchorWidget());
	}

	// Our default operations are insertions, so it should match the opposite of isInverted.
	const isInserted = !isInverted;
	changes = groupDeletedColumnChanges(
		changes,
		originalDoc,
		tr.doc,
		new Mapping(stepMaps),
		isInverted,
	);
	// A whole-table change owns every mark and attribute range inside its bounds, so those ranges
	// do not also get their own decoration.
	const tableChanges = changes.filter((change) => change.deletedColumns !== undefined);
	const isHandledByTable = (from: number, to: number) =>
		tableChanges.some((change) => from >= change.fromB && to <= change.toB);

	const createDecorationsForChange = (change: AttributedColumnAwareChange): void => {
		// Patch 2 makes all decorations generated for one replacement share this anchor. Their own
		// IDs still identify their top/bottom bounds, while this ID makes their bars agree on one
		// left edge. When the gate is off, factories retain their existing per-decoration anchors.
		const leftAnchorId = fg('platform_editor_ai_show_diff_patch_2')
			? `replacement-${change.fromA}-${change.toA}-${change.fromB}-${change.toB}`
			: undefined;
		const changeColorScheme = attributionColors
			? getColorSchemeForChange(change, attributedChanges, attributionColors, colorScheme)
			: colorScheme;
		const attributionKey = showContributorTags
			? getAttributionKeyForChange(change, attributedChanges)
			: undefined;
		const isActive = isRangeActive(activeIndexPos, change.fromB, change.toB);
		const { deletedColumns } = change;
		// On an inverted diff the table that lost columns is the one in `tr.doc`, so the column
		// indices address it directly and each label anchors inside its own cell.
		const table = tr.doc.nodeAt(change.fromB);
		if (isInverted && !hideDeletedDiffs && deletedColumns?.length && table?.type.name === 'table') {
			const tableMap = TableMap.get(table);
			deletedColumns.forEach((column) => {
				const offset = tableMap.positionAt(0, column, table);
				decorations.push(
					Decoration.widget(
						change.fromB + CELL_CONTENT_OFFSET + offset,
						() => createRemovedLozenge(intl, isActive, changeColorScheme, true),
						{ side: -1 },
					),
				);
			});
		}

		// The deleted side of a mark-only change is a byte-identical copy of the new text, so it is
		// suppressed in the clean view. `hideDeletedDiffs` is load-bearing: when false the reviewer
		// asked to compare against the original, and the deleted side is the only place the
		// previous formatting is visible.
		const isMarkOnly =
			shouldHideMarkOnlyDeletions &&
			hideDeletedDiffs &&
			change.deleted.length > 0 &&
			isMarkOnlyChange({ change, originalDoc, newDoc: tr.doc });

		// The deleted side of a change over a node's open token is an attribute state rather than
		// content, so there is nothing for the deleted-content widget to draw. Decided here, with
		// the other deleted-side suppressions, so the widget is never asked for a slice it can only
		// render as an empty copy of the block (EDITOR-8912). Its inserted side is untouched, and
		// the node's content change is a change of its own.
		const hasNoDeletedContent =
			fg('platform_editor_ai_show_diff_patch_1') &&
			change.deleted.length > 0 &&
			isOpenTokenOnlyChange({ change, originalDoc });

		// Hoisted because it decides BOTH where the deleted widget is anchored and — since the
		// widget pins whichever end of the range it sits at — how the indicator anchors below are
		// allowed to move.
		const isDeletedWidgetBelow =
			diffType === 'smart' &&
			fg('platform_editor_ai_smart_diff') &&
			isDeletedContentPlacedBelow({ change, deletedDiffPlacement, inlineDeletedDiffPlacement });

		if (change.inserted.length > 0) {
			// On an inverted diff the inserted side is visually the deleted side.
			const shouldHideDeleted = isInverted && hideDeletedDiffs;

			// A removed blank line — an empty paragraph or heading — has nothing to mark up. On an
			// inverted diff, the shape AI suggested edits renders, the block is still in the displayed
			// document, so the removal lands here on the inserted side rather than on the deleted side,
			// and both the inline and the block decoration paint nothing: an empty textblock has no
			// inline content to cover, and block decorations return no style for a paragraph or heading.
			// The reviewer sees an unmarked blank line. Stand the struck-through return glyph in for each
			// one, anchored inside the block so it renders on the blank line itself.
			//
			// One decoration per blank line rather than one per change: a run of adjacent blank lines is
			// reported as a single change spanning all of them.
			//
			// Withheld in the clean view, where removals are hidden rather than struck through.
			if (fg('platform_editor_ai_show_diff_patch_2') && !isInserted && !shouldHideDeleted) {
				for (const pos of emptyTextBlockContentPositions(tr.doc, change.fromB, change.toB)) {
					decorations.push(
						createDeletedLineBreakDecoration({
							attributionKey,
							colorScheme: changeColorScheme,
							isActive,
							pos,
							reveal,
							side: -1,
						}),
					);
				}
			}

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
			// For a large inserted table, skip the per-cell inline decorations that
			// freeze the browser on re-render. Only active when Review moment is
			// eligible (xstate + M1).
			const useCoarseTableDecoration =
				isSmartNodeLevel &&
				expValEqualsNoExposure('platform_editor_ai_xstate_migration', 'isEnabled', true) &&
				UNSAFE_expValNoExposure(
					'platform_editor_ai_streaming_ux_experience_m1',
					'isEnabled',
					false,
				) === true &&
				isLargeInsertedTableRange(tr.doc, change.fromB, change.toB);
			// Whether the deleted-content widget will actually be rendered for this
			// change. Used to decide if indicator anchor positions should be adjusted
			// inward — when the widget is present the anchor must stay at the block
			// boundary to keep the indicator bar continuous with the deleted content.
			const willRenderDeletedWidget =
				change.deleted.length > 0 &&
				!isMarkOnly &&
				!shouldHideDeletedSide({ change, hideDeletedDiffs, isInverted });

			if (isSmartNodeLevel) {
				// For a large inserted table, skip the O(cells) inline decorations inside the
				// table (the cell overlays added below provide the highlight without the
				// expensive content re-render); leaf blocks outside the table still get theirs.
				const coarseTables = useCoarseTableDecoration
					? tableRanges(tr.doc, change.fromB, change.toB)
					: [];
				for (const [from, to] of leafTextblockRanges(tr.doc, change.fromB, change.toB)) {
					if (useCoarseTableDecoration && isInsideTable(coarseTables, from)) {
						continue;
					}
					decorations.push(
						...createInlineChangedDecoration({
							attributionKey,
							change: { fromB: from, toB: to },
							leftAnchorId,
							doc: tr.doc,
							colorScheme: changeColorScheme,
							isActive,
							isInserted,
							shouldHideDeleted,
							showContributorTags,
							showIndicators,
							hideAddedDiffsUnderline,
							hasDeletedWidget: willRenderDeletedWidget,
							isDeletedWidgetBelow,
							reveal,
							tagMountContext,
						}),
					);
				}
			} else {
				decorations.push(
					...createInlineChangedDecoration({
						attributionKey,
						change,
						leftAnchorId,
						doc: tr.doc,
						colorScheme: changeColorScheme,
						isActive,
						isInserted,
						shouldHideDeleted,
						showContributorTags,
						showIndicators,
						hideAddedDiffsUnderline,
						hasDeletedWidget: willRenderDeletedWidget,
						isDeletedWidgetBelow,
						reveal,
						tagMountContext,
					}),
				);
			}

			decorations.push(
				...calculateNodesForBlockDecoration({
					attributionKey,
					doc: tr.doc,
					from: change.fromB,
					to: change.toB,
					// A split piece's own range no longer covers the container it opened (EDITOR-8932).
					nodeRanges: change.blockNodeRangesB,
					colorScheme: changeColorScheme,
					isInserted,
					shouldHideDeleted,
					showContributorTags,
					showIndicators,
					tagMountContext,
					activeIndexPos,
					intl,
					coarseTableCellsOnly: useCoarseTableDecoration,
					leftAnchorId,
				}),
			);
		}
		if (change.deleted.length > 0 && !isMarkOnly && !hasNoDeletedContent) {
			const shouldHideDeleted = shouldHideDeletedSide({
				change,
				hideDeletedDiffs,
				isInverted,
			});
			if (!shouldHideDeleted) {
				decorations.push(
					...createNodeChangedDecorationWidget({
						deletedColumns,
						// The deleted side has no inline decoration, so the widget carries the actor.
						attributionKey,
						reveal,
						change,
						doc: originalDoc,
						nodeViewSerializer,
						colorScheme: changeColorScheme,
						newDoc: tr.doc,
						intl,
						activeIndexPos,
						leftAnchorId,
						showContributorTags,
						tagMountContext,
						isInserted: !isInserted,
						hideAddedDiffsUnderline,
						placeBelow: isDeletedWidgetBelow,
						showIndicators,
					}),
				);
			}
		}
	};

	changes.forEach((change) => {
		createDecorationsForChange(change);
	});
	// The attribute-aware token encoder already reports mark-only changes as regular changes in the
	// smart path. Only add the legacy step-range decoration when no equivalent changeset range was
	// produced; otherwise the same content receives two inline decorations (and two navigation
	// changes), usually one attribution colour and one default purple decoration.
	getMarkChangeRanges(
		simplifiedSteps,
		simplifiedStepAttributions,
		fg('confluence_ncs_step_diffing_version_history') ? stepMaps : undefined,
	)
		.filter(({ fromB, toB }) => !isHandledByTable(fromB, toB))
		.filter(
			({ fromB, toB }) =>
				!fg('confluence_ncs_step_diffing_version_history') ||
				!changes.some((change) => change.fromB === fromB && change.toB === toB),
		)
		.forEach((change) => {
			const changeColorScheme = change.attributionKey
				? (attributionColors?.get(change.attributionKey) ?? colorScheme)
				: colorScheme;
			const attributionKey = showContributorTags ? change.attributionKey : undefined;
			const isActive = isRangeActive(activeIndexPos, change.fromB, change.toB);
			decorations.push(
				...createInlineChangedDecoration({
					attributionKey,
					change,
					colorScheme: changeColorScheme,
					doc: tr.doc,
					isActive,
					isInserted: true,
					reveal,
					showContributorTags,
					tagMountContext,
				}),
			);
		});
	getAttrChangeRanges(tr.doc, attrStepContexts, originalDoc)
		.filter(({ fromB, toB }) => !isHandledByTable(fromB, toB))
		.filter(
			({ fromB, toB }) =>
				!fg('confluence_ncs_step_diffing_version_history') ||
				!changes.some((change) => change.fromB === fromB && change.toB === toB),
		)
		.forEach((change) => {
			const changeColorScheme = change.attributionKey
				? (attributionColors?.get(change.attributionKey) ?? colorScheme)
				: colorScheme;
			const attributionKey = showContributorTags ? change.attributionKey : undefined;
			if (change.isInline) {
				// Inline nodes (e.g. date, emoji, mention, status) need an inline decoration rather than a block decoration
				const isActive = isRangeActive(activeIndexPos, change.fromB, change.toB);
				decorations.push(
					...createInlineChangedDecoration({
						attributionKey,
						change,
						colorScheme: changeColorScheme,
						doc: tr.doc,
						isActive,
						isInserted: true,
						isAtomicInlineNode: true,
						inlineNodeName: change.inlineNodeName,
						showContributorTags,
						tagMountContext,
						// Suppress the border-bottom underline for atomic inline nodeviews —
						// it doesn't render on custom nodeview DOM elements and is unnecessary noise.
						hideAddedDiffsUnderline: true,
					}),
				);
				// If we have the original node position, also render the old node as a "deleted" widget
				// so the user can see what it looked like before the change.
				if (change.fromA !== undefined && change.toA !== undefined) {
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
							attributionKey,
							nodeViewSerializer,
							colorScheme: changeColorScheme,
							newDoc: tr.doc,
							intl,
							activeIndexPos,
							isInserted: false,
							showContributorTags,
							tagMountContext,
						}),
					);
				}
			} else {
				decorations.push(
					...calculateNodesForBlockDecoration({
						doc: tr.doc,
						from: change.fromB,
						to: change.toB,
						attributionKey,
						colorScheme: changeColorScheme,
						isInserted: true,
						activeIndexPos,
						intl,
						showContributorTags,
						showIndicators,
						tagMountContext,
					}),
				);
				// If the original node position is known (e.g. a panel type change), also render
				// the old block node as a "deleted" widget so the reviewer sees the before/after.
				const isSmartNodeLevelAttrChange =
					diffType === 'smart' &&
					fg('platform_editor_ai_smart_diff') &&
					expValEqualsNoExposure('platform_editor_ai_xstate_migration', 'isEnabled', true) &&
					UNSAFE_expValNoExposure(
						'platform_editor_ai_streaming_ux_experience_m1',
						'isEnabled',
						false,
					) === true;
				if (isSmartNodeLevelAttrChange && change.fromA !== undefined && change.toA !== undefined) {
					const placeBelow = deletedDiffPlacement === 'bottom';
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
							attributionKey,
							colorScheme: changeColorScheme,
							newDoc: tr.doc,
							intl,
							activeIndexPos,
							isInserted: false,
							hideAddedDiffsUnderline,
							placeBelow,
							showIndicators,
							showContributorTags,
							tagMountContext,
						}),
					);
				}
			}
		});

	const decorationSet = DecorationSet.empty.add(tr.doc, decorations);

	return {
		contributorTags: showContributorTags
			? extractContributorTags(
					decorationSet,
					contributors,
					activeIndexPos,
					// The stops the step buttons walk, so a stop cannot hold a second tag for one
					// contributor that navigation can never reach.
					getScrollableDecorations(decorationSet, tr.doc),
				)
			: [],
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
		diffType?: DiffType;
		hideAddedDiffsUnderline?: boolean;
		hideDeletedDiffs?: boolean;
		inlineDeletedDiffPlacement?: InlineDeletedDiffPlacement;
		intl: IntlShape;
		isInverted?: boolean;
		nodeViewSerializer: NodeViewSerializer;
		pluginState: Omit<ShowDiffPluginState, 'decorations'>;
		reveal?: RevealOptions;
		showIndicators?: boolean;
		smartThresholds?: Partial<SmartDiffThresholds>;
		state: EditorState;
		tagMountContext?: ContributorTagMountContext;
	}) => CalculatedDiffs
> = memoizeOne(
	calculateDiffDecorationsInner,
	// Cache results unless relevant inputs change. `tagMountContext` is deliberately absent: it is
	// built once per plugin instance, so it can never be the reason a diff needs recalculating.
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
				reveal,
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
				reveal: lastReveal,
			},
		],
	) => {
		const originalDocIsSame =
			lastPluginState.originalDoc &&
			pluginState.originalDoc &&
			pluginState.originalDoc.eq(lastPluginState.originalDoc);

		return (
			(colorScheme === lastColorScheme &&
				intl.locale === lastIntl.locale &&
				isInverted === lastIsInverted &&
				diffType === lastDiffType &&
				isEqual(activeIndexPos, lastActiveIndexPos) &&
				originalDocIsSame &&
				isEqual(pluginState.steps, lastPluginState.steps) &&
				isEqual(pluginState.stepAttributions, lastPluginState.stepAttributions) &&
				// Contributors can arrive after the first calculation; without this, tags never appear.
				isEqual(pluginState.contributors, lastPluginState.contributors) &&
				state.doc.eq(lastState.doc) &&
				hideDeletedDiffs === lastHideDeletedDiffs &&
				hideAddedDiffsUnderline === lastHideAddedDiffsUnderline &&
				showIndicators === lastShowIndicators &&
				isEqual(smartThresholds, lastSmartThresholds) &&
				deletedDiffPlacement === lastDeletedDiffPlacement &&
				inlineDeletedDiffPlacement === lastInlineDeletedDiffPlacement &&
				// Turning the reveal on or off changes the emitted styles, so a cached result from the
				// other setting would leave the diff painted in the wrong resting state.
				isEqual(reveal, lastReveal)) ??
			false
		);
	},
);
