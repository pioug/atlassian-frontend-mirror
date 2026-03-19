// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import isEqual from 'lodash/isEqual';
import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { ChangeSet, simplifyChanges, type Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl-next';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Step as ProseMirrorStep, StepMap } from '@atlaskit/editor-prosemirror/transform';
import { type Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ColorScheme, ShowDiffPlugin } from '../showDiffPluginType';

import { areDocsEqualByBlockStructureAndText } from './areDocsEqualByBlockStructureAndText';
import { createBlockChangedDecoration } from './decorations/createBlockChangedDecoration';
import { createInlineChangedDecoration } from './decorations/createInlineChangedDecoration';
import { createNodeChangedDecorationWidget } from './decorations/createNodeChangedDecorationWidget';
import {
	getAttrChangeRanges,
	stepIsValidAttrChange,
} from './decorations/utils/getAttrChangeRanges';
import { getMarkChangeRanges } from './decorations/utils/getMarkChangeRanges';
import type { ShowDiffPluginState } from './main';
import type { NodeViewSerializer } from './NodeViewSerializer';
import { simplifySteps } from './simplifyChanges';

const calculateNodesForBlockDecoration = ({
	doc,
	from,
	to,
	colorScheme,
	isInserted = true,
	activeIndexPos,
}: {
	activeIndexPos?: { from: number; to: number };
	colorScheme?: ColorScheme;
	doc: EditorState['doc'];
	from: number;
	intl: IntlShape;
	isInserted?: boolean;
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
				activeIndexPos &&
				pos === activeIndexPos.from &&
				nodeEnd === activeIndexPos.to;
			const decoration = createBlockChangedDecoration({
				change: { from: pos, to: nodeEnd, name: node.type.name },
				colorScheme,
				isInserted,
				isActive,
			});
			if (decoration) {
				decorations.push(decoration);
			}
		}
	});

	return decorations;
};

/**
 * Groups adjacent changes to reduce visual fragmentation in diffs.
 * Merges consecutive insertions and deletions that are close together.
 */
function optimizeChanges(changes: Change[]): Change[] {
	if (changes.length <= 1) {
		return changes;
	}

	const optimized: Change[] = [];
	let current = { ...changes[0] };

	for (let i = 1; i < changes.length; i++) {
		const next = changes[i];

		// Check if changes are adjacent or very close (within 2 positions)
		const isAdjacent = next.fromB <= current.toB + 2;

		if (isAdjacent) {
			current = {
				fromA: current.fromA,
				toA: Math.max(current.toA, next.toA),
				fromB: current.fromB,
				toB: Math.max(current.toB, next.toB),
				deleted: [...current.deleted, ...next.deleted],
				inserted: [...current.inserted, ...next.inserted],
			};
		} else {
			optimized.push(current);
			current = { ...next };
		}
	}

	optimized.push(current);
	return optimized;
}

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
}: {
	activeIndexPos?: { from: number; to: number };
	api: ExtractInjectionAPI<ShowDiffPlugin> | undefined;
	colorScheme?: ColorScheme;
	intl: IntlShape;
	isInverted?: boolean;
	nodeViewSerializer: NodeViewSerializer;
	pluginState: Omit<ShowDiffPluginState, 'decorations'>;
	state: EditorState;
}): DecorationSet => {
	const { originalDoc, steps } = pluginState;
	if (!originalDoc || !pluginState.isDisplayingChanges) {
		return DecorationSet.empty;
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
		const recoveredViaContentEquality = fg('platform_editor_show_diff_equality_fallback')
			? areDocsEqualByBlockStructureAndText(steppedDoc, tr.doc)
			: undefined;

		if (expValEquals('platform_editor_are_nodes_equal_ignore_mark_order', 'isEnabled', true)) {
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
		}

		if (fg('platform_editor_show_diff_equality_fallback')) {
			if (!recoveredViaContentEquality) {
				return DecorationSet.empty;
			}
		} else {
			return DecorationSet.empty;
		}
	}
	const changeset = ChangeSet.create(originalDoc).addSteps(steppedDoc, stepMaps, tr.doc);
	const changes = simplifyChanges(changeset.changes, tr.doc);

	const optimizedChanges = optimizeChanges(changes);
	const decorations: Decoration[] = [];
	optimizedChanges.forEach((change) => {
		const isActive =
			activeIndexPos &&
			change.fromB === activeIndexPos.from &&
			change.toB === activeIndexPos.to;
		// Our default operations are insertions, so it should match the opposite of isInverted.
		const isInserted = !isInverted;

		if (change.inserted.length > 0) {
			decorations.push(
				createInlineChangedDecoration({
					change,
					colorScheme,
					isActive,
					...(expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && {
						isInserted,
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
					}),
					activeIndexPos,
					intl,
				}),
			);
		}
		if (change.deleted.length > 0) {
			const isActive =
			activeIndexPos &&
			change.fromB === activeIndexPos.from &&
			change.fromB === activeIndexPos.to;

			const decoration = createNodeChangedDecorationWidget({
				change,
				doc: originalDoc,
				nodeViewSerializer,
				colorScheme,
				newDoc: tr.doc,
				intl,
				isActive,
				...(expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) && {
					isInserted: !isInserted,
				}),
			});
			if (decoration) {
				decorations.push(...decoration);
			}
		}
	});
	getMarkChangeRanges(steps).forEach((change) => {
		const isActive =
			activeIndexPos &&
			change.fromB === activeIndexPos.from &&
			change.toB === activeIndexPos.to;
		decorations.push(
			createInlineChangedDecoration({ change, colorScheme, isActive, isInserted: true }),
		);
	});
	getAttrChangeRanges(tr.doc, attrSteps).forEach((change) => {
		decorations.push(
			...calculateNodesForBlockDecoration({
				doc: tr.doc,
				from: change.fromB,
				to: change.toB,
				colorScheme,
				isInserted: true,
				activeIndexPos,
				intl,
			}),
		);
	});

	return DecorationSet.empty.add(tr.doc, decorations);
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
	}: {
		activeIndexPos?: {
			from: number;
			to: number;
		};
		api: ExtractInjectionAPI<ShowDiffPlugin> | undefined;
		colorScheme?: ColorScheme;
		intl: IntlShape;
		nodeViewSerializer: NodeViewSerializer;
		pluginState: Omit<ShowDiffPluginState, 'decorations'>;
		state: EditorState;
	}) => DecorationSet
> = memoizeOne(
	calculateDiffDecorationsInner,
	// Cache results unless relevant inputs change
	(
		[{ pluginState, state, colorScheme, intl, activeIndexPos, isInverted }],
		[
			{
				pluginState: lastPluginState,
				state: lastState,
				colorScheme: lastColorScheme,
				intl: lastIntl,
				activeIndexPos: lastActiveIndexPos,
				isInverted: lastIsInverted,
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
					isEqual(activeIndexPos, lastActiveIndexPos) &&
					originalDocIsSame &&
					isEqual(pluginState.steps, lastPluginState.steps) &&
					state.doc.eq(lastState.doc)) ??
				false
			);
		}
		return (
			(originalDocIsSame &&
				isEqual(pluginState.steps, lastPluginState.steps) &&
				state.doc.eq(lastState.doc) &&
				colorScheme === lastColorScheme &&
				intl.locale === lastIntl.locale &&
				isEqual(activeIndexPos, lastActiveIndexPos)) ??
			false
		);
	},
);
