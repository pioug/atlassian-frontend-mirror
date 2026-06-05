import { nodeToJSON } from '@atlaskit/editor-json-transformer';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { getSliceFromSelection } from './context-helpers';

/**
 * Get the fragments from the selection.
 * @param selection The selection to get the fragments from.
 * @param schema The schema to use to convert the nodes to JSON.
 * @returns The fragments as an array of JSON nodes.
 */
export const getFragmentsFromSelection = (selection?: Selection): JSONNode[] | null => {
	if (!selection || selection.empty) {
		return null;
	}

	const slice = getSliceFromSelection(selection);
	const content = slice.content;

	const fragment: JSONNode[] = [];
	content.forEach((node) => {
		fragment.push(nodeToJSON(node));
	});
	return fragment;
};
