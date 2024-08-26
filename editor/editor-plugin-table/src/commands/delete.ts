import type { Command } from '@atlaskit/editor-common/types';
import type { Rect } from '@atlaskit/editor-tables/table-map';

import { deleteColumns } from '../transforms/delete-columns';
import type { PluginInjectionAPI } from '../types';
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
		if (dispatch) {
			dispatch(tr);
			return true;
		}
		return false;
	};
