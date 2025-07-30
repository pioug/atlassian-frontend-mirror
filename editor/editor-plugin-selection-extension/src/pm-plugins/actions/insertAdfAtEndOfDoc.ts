import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type { CommandDispatch } from '@atlaskit/editor-common/types';
import { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { type InsertAdfAtEndOfDocResult } from '../../types';

export const insertAdfAtEndOfDoc =
	(nodeAdf: ADFEntity) =>
	(state: EditorState, dispatch: CommandDispatch): InsertAdfAtEndOfDocResult => {
		const { tr, schema } = state;

		try {
			const docEnd = state.doc.content.size;
			const modifiedNode = Node.fromJSON(schema, nodeAdf);
			modifiedNode.check();

			tr.insert(tr.mapping.map(docEnd), modifiedNode).scrollIntoView();
			dispatch(tr);

			return { status: 'success' };
		} catch (error) {
			return { status: 'failed' };
		}
	};
