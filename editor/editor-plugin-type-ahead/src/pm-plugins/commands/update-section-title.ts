import type { Command, TypeAheadSectionTitleUpdate } from '@atlaskit/editor-common/types';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { TypeAheadSectionTitleUpdateState } from '../../types';
import { ACTIONS } from '../actions';
import { pluginKey as typeAheadPluginKey } from '../key';

export const updateSectionTitle = ({
	id,
	title,
	sectionTitleDisplay,
}: TypeAheadSectionTitleUpdate): Command => {
	return (state, dispatch) => {
		if (!expVal('platform_editor_agent_mentions', 'isEnabled', false) || !dispatch) {
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
