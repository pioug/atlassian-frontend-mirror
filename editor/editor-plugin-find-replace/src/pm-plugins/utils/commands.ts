import type { Command, HigherOrderCommand } from '@atlaskit/editor-common/types';

export const withScrollIntoView: HigherOrderCommand =
	(command: Command): Command =>
	(state, dispatch, view) =>
		command(
			state,
			(tr) => {
				tr.scrollIntoView();
				if (dispatch) {
					dispatch(tr);
				}
			},
			view,
		);
