import { traverse } from '@atlaskit/adf-utils/traverse';
import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

/**
 * Promotes `panel` nodes to `panel_c1` wherever their content makes them invalid
 * as a standard `panel` but valid as a `panel_c1` (e.g. when a panel contains a table).
 *
 * Useful for insertion paths where content is being inserted as ADF and we want to
 * use the standard panel type where possible, but upgrade when required by the content.
 */
export function transformContainerNodesWhenRequired(
	adf: ADFEntity,
	schema: Schema,
): {
	isTransformed: boolean;
	transformedAdf: ADFEntity | false;
} {
	let isTransformed = false;

	const { panel, panel_c1 } = schema.nodes;

	if (!panel || !panel_c1) {
		return { transformedAdf: adf, isTransformed: false };
	}

	const transformedAdf = traverse(adf, {
		panel: (node) => {
			if (!node.content) {
				return;
			}
			const fragment = Fragment.fromJSON(schema, node.content);
			if (!panel.validContent(fragment) && panel_c1.validContent(fragment)) {
				isTransformed = true;
				return { ...node, type: 'panel_c1' };
			}
			return;
		},
	});

	return {
		transformedAdf,
		isTransformed,
	};
}
