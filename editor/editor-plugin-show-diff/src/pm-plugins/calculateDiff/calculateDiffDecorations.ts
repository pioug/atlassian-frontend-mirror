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
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type {
	ColorScheme,
	DiffDescriptor,
	DiffType,
	ShowDiffPlugin,
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
import type { ShowDiffPluginState } from '../main';
import type { NodeViewSerializer } from '../NodeViewSerializer';

import { diffBySteps, getStepChanges } from './diffBySteps';
import { groupChangesByBlock } from './groupChangesByBlock';
import { optimizeChanges } from './optimizeChanges';
import { simplifySteps } from './simplifySteps';

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
}: {
	changeset: ChangeSet;
	diffType: DiffType;
	originalDoc: PMNode;
	steppedDoc: PMNode;
	steps: ProseMirrorStep[];
	tr: Transaction;
}): Change[] => {
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
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

const calculateNodesForBlockDecoration = ({
	doc,
	from,
	to,
	colorScheme,
	isInserted = true,
	activeIndexPos,
	shouldHideDeleted = false,
	showIndicators = false,
}: {
	activeIndexPos?: { from: number; to: number };
	colorScheme?: ColorScheme;
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
		if (
			node.isBlock &&
			(!expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) ||
				pos + node.nodeSize <= to)
		) {
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
	showIndicators = false,
}: {
	activeIndexPos?: { from: number; to: number };
	api: ExtractInjectionAPI<ShowDiffPlugin> | undefined;
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	hideDeletedDiffs?: boolean;
	intl: IntlShape;
	isInverted?: boolean;
	nodeViewSerializer: NodeViewSerializer;
	pluginState: Omit<ShowDiffPluginState, 'decorations'>;
	showIndicators?: boolean;
	state: EditorState;
}): CalculatedDiffs => {
	const { originalDoc, steps, isDisplayingChanges } = pluginState;
	if (!originalDoc || !isDisplayingChanges) {
		return { decorations: DecorationSet.empty, diffDescriptors: [] };
	}

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
	});

	const decorations: Decoration[] = [];

	/**
	 * If showIndicators is on, we create an anchor widget here to mark the doc margin.
	 */
	if (showIndicators && expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
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
			const shouldHideDeleted = expValEquals(
				'platform_editor_diff_plugin_extended',
				'isEnabled',
				true,
			)
				? isInverted && (hideDeletedDiffs || showGranularWithBlock) && change.deleted.length > 0
				: false;
			decorations.push(
				...createInlineChangedDecoration({
					change,
					doc: tr.doc,
					colorScheme,
					isActive,
					...(expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && {
						isInserted,
						shouldHideDeleted,
						showIndicators,
					}),
				}),
			);

			decorations.push(
				...calculateNodesForBlockDecoration({
					doc: tr.doc,
					from: change.fromB,
					to: change.toB,
					colorScheme,
					...(expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && {
						isInserted,
						shouldHideDeleted,
						showIndicators,
					}),
					activeIndexPos,
					intl,
				}),
			);
		}
		if (change.deleted.length > 0) {
			const shouldHideDeleted = expValEquals(
				'platform_editor_diff_plugin_extended',
				'isEnabled',
				true,
			)
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
						...(expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && {
							isInserted: !isInserted,
							diffType,
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
			if (showGranularWithBlock && stepChangeList.length > 0) {
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
	getAttrChangeRanges(tr.doc, attrSteps).forEach((change) => {
		if (change.isInline) {
			// Inline nodes (e.g. date) need an inline decoration rather than a block decoration
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
		showIndicators,
	}: {
		activeIndexPos?: {
			from: number;
			to: number;
		};
		api: ExtractInjectionAPI<ShowDiffPlugin> | undefined;
		colorScheme?: ColorScheme;
		hideDeletedDiffs?: boolean;
		intl: IntlShape;
		nodeViewSerializer: NodeViewSerializer;
		pluginState: Omit<ShowDiffPluginState, 'decorations'>;
		showIndicators?: boolean;
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
				showIndicators,
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
				showIndicators: lastShowIndicators,
			},
		],
	) => {
		const originalDocIsSame =
			lastPluginState.originalDoc &&
			pluginState.originalDoc &&
			pluginState.originalDoc.eq(lastPluginState.originalDoc);

		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
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
					showIndicators === lastShowIndicators) ??
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
