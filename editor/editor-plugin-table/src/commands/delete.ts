import type { Command } from '@atlaskit/editor-common/types';
import type { Rect } from '@atlaskit/editor-tables/table-map';

import { deleteColumns } from '../transforms/delete-columns';
import { getAllowAddColumnCustomStep } from '../utils/get-allow-add-column-custom-step';

export const deleteColumnsCommand =
	(rect: Rect, isTableScalingEnabled = false, shouldUseIncreasedScalingPercent = false): Command =>
	(state, dispatch, view) => {
		const tr = deleteColumns(
			rect,
			getAllowAddColumnCustomStep(state),
			view,
			isTableScalingEnabled,
			shouldUseIncreasedScalingPercent,
		)(state.tr);
		if (dispatch) {
			dispatch(tr);
			return true;
		}
		return false;
	};
