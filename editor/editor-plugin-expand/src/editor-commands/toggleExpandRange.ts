import { expandedState } from '@atlaskit/editor-common/expand';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const toggleExpandRange =
	(from?: number, to?: number, open: boolean = true): EditorCommand =>
	({ tr }) => {
		const { expand, nestedExpand } = tr.doc.type.schema.nodes;
		const fromClamped = from && from >= 0 ? from : 0;
		const toClamped = to && to <= tr.doc.content.size ? to : tr.doc.content.size;
		tr.doc.nodesBetween(fromClamped, toClamped, (node) => {
			if ([expand, nestedExpand].includes(node.type)) {
				expandedState.set(node, open);
			}
		});

		if (expValEquals('platform_editor_aifc_expand_collapses_oncreate_fix', 'isEnabled', true)) {
			return tr;
		}

		return null;
	};
