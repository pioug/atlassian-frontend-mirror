import { currentMediaNodeWithPos } from '@atlaskit/editor-common/media-single';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { currentMediaInlineNodeWithPos } from '../../pm-plugins/utils/current-media-node';

export function shouldShowImageBorder(editorState: EditorState): boolean {
	const border = editorState.schema.marks.border;
	if (!border) {
		return false;
	}

	const nodeWithPos =
		currentMediaNodeWithPos(editorState) || currentMediaInlineNodeWithPos(editorState);
	if (!nodeWithPos) {
		return false;
	}

	const { parent } = editorState.doc.resolve(nodeWithPos.pos);

	return parent && parent.type.allowsMarkType(border);
}
