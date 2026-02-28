// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { ChangeSet, simplifyChanges, type Change } from 'prosemirror-changeset';
import type { IntlShape } from 'react-intl-next';

import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Step as ProseMirrorStep, StepMap } from '@atlaskit/editor-prosemirror/transform';
import { type Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { getAttrChangeRanges, stepIsValidAttrChange } from './attributeDecorations';
import {
	createInlineChangedDecoration,
	createDeletedContentDecoration,
	createBlockChangedDecoration,
} from './decorations';
import type { ShowDiffPluginState } from './main';
import { getMarkChangeRanges } from './markDecorations';
import type { NodeViewSerializer } from './NodeViewSerializer';
import { simplifySteps } from './simplifyChanges';

const calculateNodesForBlockDecoration = (
	doc: EditorState['doc'],
	from: number,
	to: number,
	colourScheme?: 'standard' | 'traditional',
): Decoration[] => {
	const decorations: Decoration[] = [];
	// Iterate over the document nodes within the range
	doc.nodesBetween(from, to, (node, pos) => {
		if (node.isBlock) {
			decorations.push(
				createBlockChangedDecoration(
					{ from: pos, to: pos + node.nodeSize, name: node.type.name },
					colourScheme,
				),
			);
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

const calculateDiffDecorationsInner = ({
	state,
	pluginState,
	nodeViewSerializer,
	colourScheme,
	intl,
	activeIndexPos,
}: {
	activeIndexPos?: { from: number; to: number };
	colourScheme?: 'standard' | 'traditional';
	intl: IntlShape;
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
		return DecorationSet.empty;
	}
	const changeset = ChangeSet.create(originalDoc).addSteps(steppedDoc, stepMaps, tr.doc);
	const changes = simplifyChanges(changeset.changes, tr.doc);

	const optimizedChanges = optimizeChanges(changes);
	const decorations: Decoration[] = [];
	optimizedChanges.forEach((change) => {
		const isActive =
			activeIndexPos && change.fromB >= activeIndexPos.from && change.toB <= activeIndexPos.to;
		if (change.inserted.length > 0) {
			decorations.push(createInlineChangedDecoration(change, colourScheme, isActive));
			decorations.push(
				...calculateNodesForBlockDecoration(tr.doc, change.fromB, change.toB, colourScheme),
			);
		}
		if (change.deleted.length > 0) {
			const isActive =
				activeIndexPos && change.fromB >= activeIndexPos.from && change.toB <= activeIndexPos.to;
			const decoration = createDeletedContentDecoration({
				change,
				doc: originalDoc,
				nodeViewSerializer,
				colourScheme,
				newDoc: tr.doc,
				intl,
				isActive,
			});
			if (decoration) {
				decorations.push(...decoration);
			}
		}
	});
	getMarkChangeRanges(steps).forEach((change) => {
		const isActive =
			activeIndexPos && change.fromB >= activeIndexPos.from && change.toB <= activeIndexPos.to;
		decorations.push(createInlineChangedDecoration(change, colourScheme, isActive));
	});
	getAttrChangeRanges(tr.doc, attrSteps).forEach((change) => {
		decorations.push(
			...calculateNodesForBlockDecoration(tr.doc, change.fromB, change.toB, colourScheme),
		);
	});

	return DecorationSet.empty.add(tr.doc, decorations);
};

export const calculateDiffDecorations = memoizeOne(
	calculateDiffDecorationsInner,
	// Cache results unless relevant inputs change
	(
		[{ pluginState, state, colourScheme, intl, activeIndexPos }],
		[
			{
				pluginState: lastPluginState,
				state: lastState,
				colourScheme: lastColourScheme,
				intl: lastIntl,
				activeIndexPos: lastActiveIndexPos,
			},
		],
	) => {
		const originalDocIsSame =
			lastPluginState.originalDoc &&
			pluginState.originalDoc &&
			pluginState.originalDoc.eq(lastPluginState.originalDoc);
		return (
			(originalDocIsSame &&
				isEqual(pluginState.steps, lastPluginState.steps) &&
				state.doc.eq(lastState.doc) &&
				colourScheme === lastColourScheme &&
				intl.locale === lastIntl.locale &&
				isEqual(activeIndexPos, lastActiveIndexPos)) ??
			false
		);
	},
);
