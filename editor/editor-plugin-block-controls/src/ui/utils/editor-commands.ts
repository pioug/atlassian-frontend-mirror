import type { EditorCommand } from '@atlaskit/editor-common/types';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

export const createNewLine =
	(start: number): EditorCommand =>
	({ tr }) => {
		const nodeSize = tr.doc.nodeAt(start)?.nodeSize;
		if (nodeSize === undefined) {
			return tr;
		}
		const position = start + nodeSize;
		tr.insert(position, tr.doc.type.schema.nodes.paragraph.create());
		return tr.setSelection(
			fg('platform_editor_controls_patch_14')
				? TextSelection.near(tr.doc.resolve(position))
				: TextSelection.create(tr.doc, position),
		);
	};
