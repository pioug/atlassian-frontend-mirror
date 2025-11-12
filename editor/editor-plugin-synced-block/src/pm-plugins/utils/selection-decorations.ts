import { BodiedSyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

export const calculateDecorations = (
	doc: PMNode,
	selection: Selection,
	schema: Schema,
): DecorationSet => {
	const { bodiedSyncBlock } = schema.nodes;
	const syncBlockParent = findParentNodeOfType(bodiedSyncBlock)(selection);

	if (syncBlockParent) {
		const { node, pos } = syncBlockParent;
		const decoration = Decoration.node(pos, pos + node.nodeSize, {
			class: `${BodiedSyncBlockSharedCssClassName.selectionInside}`,
		});

		return DecorationSet.create(doc, [decoration]);
	}

	return DecorationSet.empty;
};
