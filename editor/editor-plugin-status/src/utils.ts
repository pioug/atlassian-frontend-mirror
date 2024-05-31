import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';

import type { StatusType } from './types';

export const mayGetStatusAtSelection = (selection: Selection): StatusType | null => {
	if (selection && selection instanceof NodeSelection) {
		const nodeSelection = selection as NodeSelection;
		if (nodeSelection.node.type.name === 'status') {
			return (selection.node.attrs as StatusType) || null;
		}
	}
	return null;
};

export const isEmptyStatus = (node: StatusType): boolean =>
	node && ((node.text && node.text.trim().length === 0) || node.text === '');

export const setNodeSelectionNearPos = (tr: Transaction, pos: number): Transaction =>
	tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map(pos)));
