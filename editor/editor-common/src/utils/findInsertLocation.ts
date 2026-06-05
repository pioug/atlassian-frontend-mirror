import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNode } from '@atlaskit/editor-prosemirror/utils';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

export function findInsertLocation(selection: Selection): string {
	const { schema, name } = selection.$from.doc.type;
	if (selection instanceof NodeSelection) {
		return selection.node.type.name;
	}

	if (selection instanceof CellSelection) {
		return schema.nodes.table.name;
	}

	// Text selection
	const parentNodeInfo = findParentNode((node) => node.type !== schema.nodes.paragraph)(selection);

	return parentNodeInfo ? parentNodeInfo.node.type.name : name;
}
