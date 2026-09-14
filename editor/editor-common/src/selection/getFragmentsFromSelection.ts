import { toJSON as unsanitizedNodeToJSON } from '@atlaskit/editor-json-transformer/toJSON';
import type { JSONNode } from '@atlaskit/editor-json-transformer/types';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { nodeToJSON } from '../utils/nodes';

import { getSliceFromSelection } from './context-helpers';

/**
 * Get the fragments from the selection.
 *
 * The result crosses an editor boundary — Remix, Rovo/convo-ai and AIFC treat it as persistable
 * ADF. The two same-named `nodeToJSON` exports are not interchangeable: `editor-json-transformer`'s
 * is a verbatim ProseMirror serialisation and leaks schema-only container variants such as
 * `panel_c1`, while `../utils/nodes` sanitises.
 *
 * `keepNestedTables: true` keeps the gate scoped to that strip — the sanitiser would otherwise also
 * rewrite nested tables into an extension carrying stringified ADF.
 */
export const getFragmentsFromSelection = (selection?: Selection): JSONNode[] | null => {
	if (!selection || selection.empty) {
		return null;
	}

	const slice = getSliceFromSelection(selection);
	const content = slice.content;

	const sanitizeFragments = fg('platform_editor_sanitize_selection_fragments');

	const fragment: JSONNode[] = [];
	content.forEach((node) => {
		fragment.push(
			sanitizeFragments
				? nodeToJSON(node, { keepNestedTables: true })
				: unsanitizedNodeToJSON(node),
		);
	});
	return fragment;
};
