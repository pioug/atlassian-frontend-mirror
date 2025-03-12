import type { EditorCommand } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

export const createNewLine =
	(start: number): EditorCommand =>
	({ tr }) => {
		const nodeSize = tr.doc.nodeAt(start)?.nodeSize;
		if (nodeSize === undefined) {
			return tr;
		}
		const position = start + nodeSize;
		tr.insert(position, tr.doc.type.schema.nodes.paragraph.create());
		return tr.setSelection(TextSelection.create(tr.doc, position));
	};
