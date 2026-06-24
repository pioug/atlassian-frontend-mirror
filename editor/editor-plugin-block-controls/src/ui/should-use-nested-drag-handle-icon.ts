import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

// Nested icon for non-top-level nodes when the experiment is on. Exception: with the
// kill switch OFF, layout columns use the full block handle instead.
// TODO: EDITOR-7732 - remove this whole function when
// `platform_editor_layout_column_menu_kill_switch_1` is cleaned up
export const shouldUseNestedDragHandleIcon = (
	isTopLevelNode: boolean,
	isLayoutColumn: boolean,
): boolean => {
	if (!expValEquals('platform_editor_nested_drag_handle_icon', 'isEnabled', true)) {
		return false;
	}

	if (isTopLevelNode) {
		return false;
	}

	if (isLayoutColumn && !fg('platform_editor_layout_column_menu_kill_switch_1')) {
		return false;
	}

	return true;
};
