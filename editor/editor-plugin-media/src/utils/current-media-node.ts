import type { BorderMarkAttributes } from '@atlaskit/adf-schema';
import { currentMediaNodeWithPos } from '@atlaskit/editor-common/media-single';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

export const currentMediaInlineNodeWithPos = (
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
		selection.node.type !== schema.nodes.mediaInline
	) {
		return;
	}

	const pos = selection.$anchor.pos;

	const node = doc.nodeAt(pos);

	if (!node || node.type !== schema.nodes.mediaInline) {
		return;
	}

	return {
		node,
		pos,
	};
};

export const currentMediaNode = (editorState: EditorState): PMNode | undefined => {
	return currentMediaNodeWithPos(editorState)?.node;
};

export const currentMediaInlineNode = (editorState: EditorState): PMNode | undefined => {
	return currentMediaInlineNodeWithPos(editorState)?.node;
};

export const currentMediaOrInlineNodeBorderMark = (
	editorState: EditorState,
): BorderMarkAttributes | undefined => {
	const node = currentMediaNode(editorState) || currentMediaInlineNode(editorState);

	if (!node) {
		return;
	}

	const borderMark = node.marks.find((m) => m.type.name === 'border');

	if (!borderMark) {
		return;
	}

	return borderMark.attrs as BorderMarkAttributes;
};
