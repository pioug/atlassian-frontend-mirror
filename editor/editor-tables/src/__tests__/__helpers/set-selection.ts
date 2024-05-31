// eslint-disable-next-line import/no-extraneous-dependencies
import type { Refs, RefsNode } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';

const positionExists = (position: number | undefined): boolean => typeof position === 'number';

export function setSelectionTransform(doc: RefsNode, tr: Transaction) {
	let refs: Refs = doc.refs;

	if (refs) {
		// Collapsed selection.
		if (positionExists(refs['<>'])) {
			tr.setSelection(TextSelection.create(tr.doc, refs['<>']));
			// Expanded selection
		} else if (positionExists(refs['<']) || positionExists(refs['>'])) {
			if (!positionExists(refs['<'])) {
				throw new Error('A `<` ref must complement a `>` ref.');
			}
			if (!positionExists(refs['>'])) {
				throw new Error('A `>` ref must complement a `<` ref.');
			}
			tr.setSelection(TextSelection.create(tr.doc, refs['<'], refs['>']));
		}
		// NodeSelection
		else if (positionExists(refs['<node>'])) {
			tr.setSelection(NodeSelection.create(tr.doc, refs['<node>']));
		}
	}

	return {
		tr,
		refs,
	};
}
