import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { nodeToJSON } from '../utils/nodes';
import { getSliceFromSelection } from './context-helpers';

/**
 * Selection fragments cross an editor boundary: Remix, Rovo/convo-ai and AIFC consume them as
 * persistable ADF, so schema-only container variants must be sanitized. Nested tables remain intact
 * rather than being converted into extensions containing stringified ADF.
 */
export const getFragmentsFromSelection = (selection?: Selection): JSONNode[] | null => {
	if (!selection || selection.empty) {
		return null;
	}

	const slice = getSliceFromSelection(selection);
	const content = slice.content;

	const fragment: JSONNode[] = [];
	content.forEach((node) => {
		fragment.push(nodeToJSON(node, { keepNestedTables: true }));
	});
	return fragment;
};
