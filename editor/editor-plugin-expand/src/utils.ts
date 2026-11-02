import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { hasParentNode } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const isNestedInExpand = (state: EditorState): boolean =>
	hasParentNode(
		(node) =>
			node.type === state.schema.nodes.expand || node.type === state.schema.nodes.nestedExpand,
	)(state.selection);

/** The element wrapping an expand's title and content, found from a position inside its content. */
export const getExpandWrapper = (editorView: EditorView, pos: number): HTMLElement | null =>
	editorView.domAtPos(pos).node.parentElement;

/** The title input of the expand whose content contains `pos`. */
export const getExpandTitleInput = (editorView: EditorView, pos: number): HTMLInputElement | null =>
	getExpandWrapper(editorView, pos)?.querySelector('input') ?? null;
