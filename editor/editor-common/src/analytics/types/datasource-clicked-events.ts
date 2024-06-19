import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID, type EVENT_TYPE } from './enums';

export type DatasourceClickedPayload = {
	action: ACTION.CLICKED;
	actionSubject: ACTION_SUBJECT.BUTTON;
	actionSubjectId: ACTION_SUBJECT_ID.EDIT_DATASOURCE;
	eventType: EVENT_TYPE.UI;
	attributes?: {
		extensionKey?: string;
		appearance?: string;
	};
};
