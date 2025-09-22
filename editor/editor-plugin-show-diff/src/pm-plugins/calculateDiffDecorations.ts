// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ChangeSet, simplifyChanges } from 'prosemirror-changeset';

import { areNodesEqualIgnoreAttrs } from '@atlaskit/editor-common/utils/document';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { type Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { createInlineChangedDecoration, createDeletedContentDecoration } from './decorations';
import type { ShowDiffPluginState } from './main';
import { getMarkChangeRanges } from './markDecorations';
import type { NodeViewSerializer } from './NodeViewSerializer';

export const calculateDiffDecorations = ({
	state,
	pluginState,
	nodeViewSerializer,
	colourScheme,
}: {
	colourScheme?: 'standard' | 'traditional';
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

	let changeset = ChangeSet.create(originalDoc);
	for (const step of steps) {
		const result = step.apply(steppedDoc);
		if (result.failed === null && result.doc) {
			steppedDoc = result.doc;
			changeset = changeset.addSteps(steppedDoc, [step.getMap()], tr.doc);
		}
	}
	// Rather than using .eq() we use a custom function that only checks for structural
	// changes and ignores differences in attributes which don't affect decoration positions
	if (!areNodesEqualIgnoreAttrs(steppedDoc, tr.doc)) {
		return DecorationSet.empty;
	}
	const changes = simplifyChanges(changeset.changes, tr.doc);
	const decorations: Decoration[] = [];
	changes.forEach((change) => {
		if (change.inserted.length > 0) {
			decorations.push(createInlineChangedDecoration(change, colourScheme));
		}
		if (change.deleted.length > 0) {
			const decoration = createDeletedContentDecoration({
				change,
				doc: originalDoc,
				nodeViewSerializer,
				colourScheme,
			});
			if (decoration) {
				decorations.push(decoration);
			}
		}
	});
	getMarkChangeRanges(steps).forEach((change) => {
		decorations.push(createInlineChangedDecoration(change, colourScheme));
	});

	return DecorationSet.empty.add(tr.doc, decorations);
};
