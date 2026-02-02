import { isExpandCollapsed } from '@atlaskit/editor-common/expand';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

// from platform/packages/editor/editor-plugin-find-replace/src/ui/styles.ts
const darkModeSearchMatchClass = 'search-match-dark';
const searchMatchExpandTitleClass = 'search-match-expand-title';
const selectedSearchMatchClass = 'selected-search-match';

export const findSelectedParentExpandNode = (
	state: EditorState,
): ReturnType<ReturnType<typeof findParentNodeOfType>> => {
	const nestedOrParentExpand =
		findParentNodeOfType(state.schema.nodes.nestedExpand)(state.selection) ||
		findParentNodeOfType(state.schema.nodes.expand)(state.selection);

	if (expValEquals('platform_editor_display_none_to_expand', 'isEnabled', true)) {
		// If it's nested expand, we should check if its parent expand is collapsed.
		// If the parent expand is collapsed, the nested expand is not visible,
		// so it could not be selected.
		// In this case, we return the parent expand node instead of the nested expand node.
		if (nestedOrParentExpand?.node.type === state.schema.nodes.nestedExpand) {
			const parentExpand = findParentNodeOfType(state.schema.nodes.expand)(state.selection);
			if (parentExpand && isExpandCollapsed(parentExpand.node)) {
				return parentExpand;
			}
		}
	}

	return nestedOrParentExpand;
};

export const findReplaceExpandDecorations: string[] = [
	darkModeSearchMatchClass,
	searchMatchExpandTitleClass,
	selectedSearchMatchClass,
];
