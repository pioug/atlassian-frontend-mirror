import { NATIVE_EMBED_EXTENSION_TYPE } from '@atlaskit/editor-common/extensions';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';

/**
 * Returns the currently selected extension node, if any.
 */
const getSelectedExtension = (state: EditorState) => {
	const { schema, selection } = state;
	return findSelectedNodeOfType(schema.nodes.extension)(selection) || undefined;
};

/**
 * Checks whether a given ProseMirror node is a native-embed extension.
 */
const isNativeEmbedExtension = (node: PMNode): boolean => {
	return node.attrs?.extensionType === NATIVE_EMBED_EXTENSION_TYPE;
};

/**
 * Returns the currently selected native-embed extension node, or undefined
 * if the selection is not inside a native-embed extension.
 */
export const getSelectedNativeEmbedExtension = (state: EditorState) => {
	const selected = getSelectedExtension(state);
	if (selected && isNativeEmbedExtension(selected.node)) {
		return selected;
	}
	return undefined;
};
