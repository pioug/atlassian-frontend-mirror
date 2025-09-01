// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { ChangeSet, simplifyChanges } from 'prosemirror-changeset';

import type { Node as PMNode, Fragment } from '@atlaskit/editor-prosemirror/model';
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
}: {
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
	if (!areNodesEqual(steppedDoc, tr.doc)) {
		return DecorationSet.empty;
	}
	const changes = simplifyChanges(changeset.changes, tr.doc);
	const decorations: Decoration[] = [];
	changes.forEach((change) => {
		if (change.inserted.length > 0) {
			decorations.push(createInlineChangedDecoration(change));
		}
		if (change.deleted.length > 0) {
			const decoration = createDeletedContentDecoration({
				change,
				doc: originalDoc,
				nodeViewSerializer,
			});
			if (decoration) {
				decorations.push(decoration);
			}
		}
	});
	getMarkChangeRanges(steps).forEach((change) => {
		decorations.push(createInlineChangedDecoration(change));
	});

	return DecorationSet.empty.add(tr.doc, decorations);
};

/**
 * Compares two ProseMirror documents for equality, ignoring attributes
 * which don't affect the document structure.
 *
 * This is almost a copy of the .eq() PM function - tweaked to ignore attrs
 *
 * @param doc1 PMNode
 * @param doc2 PMNode
 * @returns boolean
 */
export function areNodesEqual(node1: PMNode, node2: PMNode): boolean {
	if (node1.isText) {
		return node1.eq(node2);
	}
	return (
		node1 === node2 ||
		(node1.hasMarkup(node2.type, node1.attrs, node2.marks) &&
			areFragmentsEqual(node1.content, node2.content))
	);
}

function areFragmentsEqual(frag1: Fragment, frag2: Fragment): boolean {
	if (frag1.content.length !== frag2.content.length) {
		return false;
	}
	let childrenEqual = true;
	frag1.content.forEach((child, i) => {
		const otherChild = frag2.child(i);
		if (child === otherChild || (otherChild && areNodesEqual(child, otherChild))) {
			return;
		}
		childrenEqual = false;
	});
	return childrenEqual;
}
