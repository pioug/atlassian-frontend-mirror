import type { Command } from '@atlaskit/editor-common/types';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import { fg } from '@atlaskit/platform-feature-flags';

import type { PluginInjectionAPI } from '../../types';
import { pluginKey } from '../plugin-key';
import { deleteColumns } from '../transforms/delete-columns';
import { getAllowAddColumnCustomStep } from '../utils/get-allow-add-column-custom-step';

export const deleteColumnsCommand =
	(
		rect: Rect,
		api: PluginInjectionAPI | undefined | null,
		isTableScalingEnabled = false,
		isTableFixedColumnWidthsOptionEnabled = false,
		shouldUseIncreasedScalingPercent = false,
		isCommentEditor = false,
	): Command =>
	(state, dispatch, view) => {
		const tr = deleteColumns(
			rect,
			getAllowAddColumnCustomStep(state),
			api,
			view,
			isTableScalingEnabled,
			isTableFixedColumnWidthsOptionEnabled,
			shouldUseIncreasedScalingPercent,
			isCommentEditor,
		)(state.tr);
		// If we delete a column we should also clean up the hover selection
		if (fg('platform_editor_remove_slow_table_transactions')) {
			tr.setMeta(pluginKey, {
				type: 'CLEAR_HOVER_SELECTION',
				data: {
					isInDanger: false,
					isWholeTableInDanger: false,
				},
			});
		}
		if (dispatch) {
			dispatch(tr);
			return true;
		}
		return false;
	};
