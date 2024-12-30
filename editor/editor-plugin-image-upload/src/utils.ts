import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

export const isMediaSelected = (state: EditorState): boolean => {
	const { media } = state.schema.nodes;

	return state.selection instanceof NodeSelection && state.selection.node.type === media;
};

export const canInsertMedia = (state: EditorState): boolean => {
	const { mediaSingle } = state.schema.nodes;
	const { $to } = state.selection;

	if (mediaSingle) {
		for (let d = $to.depth; d >= 0; d--) {
			const index = $to.index(d);
			if ($to.node(d).canReplaceWith(index, index, mediaSingle)) {
				return true;
			}
		}
	}
	return false;
};

export const createExternalMediaNode = (url: string, schema: Schema): Node | null => {
	const { media, mediaSingle } = schema.nodes;
	if (!media || !mediaSingle) {
		return null;
	}

	const mediaNode = media.createChecked({
		type: 'external',
		url,
	});
	return mediaSingle.createChecked({}, mediaNode);
};
