import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

/**
 *
 * @param editorState current editor state
 * @returns selected media node (child of mediaSingle only) with position
 */
export const currentMediaNodeWithPos = (
	editorState: EditorState,
):
	| {
			node: PMNode;
			pos: number;
	  }
	| undefined => {
	const { doc, selection, schema } = editorState;

	if (
		!doc ||
		!selection ||
		!(selection instanceof NodeSelection) ||
		selection.node.type !== schema.nodes.mediaSingle
	) {
		return;
	}

	const pos = selection.$anchor.pos + 1;

	const node = doc.nodeAt(pos);

	if (!node || node.type !== schema.nodes.media) {
		return;
	}

	return {
		node,
		pos,
	};
};
