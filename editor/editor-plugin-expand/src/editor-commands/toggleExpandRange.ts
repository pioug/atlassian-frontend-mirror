import { expandedState } from '@atlaskit/editor-common/expand';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const TOGGLE_EXPAND_RANGE_META_KEY = 'toggleExpandRange';

export const toggleExpandRange =
	(from?: number, to?: number, open: boolean = true): EditorCommand =>
	({ tr }) => {
		const { expand, nestedExpand } = tr.doc.type.schema.nodes;
		const fromClamped = from && from >= 0 ? from : 0;
		const toClamped = to && to <= tr.doc.content.size ? to : tr.doc.content.size;

		const positions: number[] = [];
		tr.doc.nodesBetween(fromClamped, toClamped, (node, pos) => {
			if ([expand, nestedExpand].includes(node.type)) {
				expandedState.set(node, open);
				positions.push(pos);
			}
		});

		if (fg('platform_editor_show_diff_scroll_navigation')) {
			if (positions.length === 0) {
				// No expand nodes found in the range — nothing to dispatch.
				return null;
			}

			// Set meta so the expand PM plugin can add node decorations.
			// This ensures ExpandNodeView.update() receives the decoration and visually
			// opens or closes the expand, even when the experiment below is disabled.
			tr.setMeta(TOGGLE_EXPAND_RANGE_META_KEY, { positions, open });
			return tr;
		}

		if (expValEquals('platform_editor_aifc_expand_collapses_oncreate_fix', 'isEnabled', true)) {
			return tr;
		}

		return null;
	};
