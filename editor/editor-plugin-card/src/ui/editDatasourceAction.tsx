import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { type Command } from '@atlaskit/editor-common/types';
import { getDatasourceType } from '@atlaskit/editor-common/utils';

import { showDatasourceModal } from '../pm-plugins/actions';
import { type CardType } from '../types';

export const editDatasource =
	(
		datasourceId: string,
		editorAnalyticsApi?: EditorAnalyticsAPI,
		appearance?: CardType,
		extensionKey?: string,
	): Command =>
	(state, dispatch) => {
		const datasourceType = getDatasourceType(datasourceId);
		if (dispatch && datasourceType) {
			const { tr } = state;
			showDatasourceModal(datasourceType)(tr);
			editorAnalyticsApi?.attachAnalyticsEvent({
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BUTTON,
				actionSubjectId: ACTION_SUBJECT_ID.EDIT_DATASOURCE,
				eventType: EVENT_TYPE.UI,
				attributes: {
					extensionKey,
					appearance,
				},
			})(tr);
			dispatch(tr);
			return true;
		}
		return false;
	};
