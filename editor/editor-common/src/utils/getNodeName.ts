import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export const getNodeName = (state: EditorState, node?: PMNode): string => {
	return node?.marks?.find((mark) => mark.type === state.schema.marks.fragment)?.attrs?.name ?? '';
};
