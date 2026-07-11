import type { Command, TypeAheadSectionTitleUpdate } from '@atlaskit/editor-common/types';

import type { TypeAheadSectionTitleUpdateState } from '../../types';
import { ACTIONS } from '../actions';
import { pluginKey as typeAheadPluginKey } from '../key';

export const updateSectionTitle = ({
	id,
	title,
	sectionTitleDisplay,
}: TypeAheadSectionTitleUpdate): Command => {
	return (state, dispatch) => {
		if (!dispatch) {
			return false;
		}

		const tr = state.tr;
		const update: TypeAheadSectionTitleUpdateState = {
			title,
		};

		if (sectionTitleDisplay !== undefined) {
			update.sectionTitleDisplay = sectionTitleDisplay;
		}

		tr.setMeta(typeAheadPluginKey, {
			action: ACTIONS.UPDATE_SECTION_TITLE,
			params: {
				id,
				update,
			},
		});

		dispatch(tr);

		return true;
	};
};
