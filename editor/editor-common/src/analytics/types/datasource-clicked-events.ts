import { type ACTION, type ACTION_SUBJECT, type ACTION_SUBJECT_ID, type EVENT_TYPE } from './enums';

export type DatasourceClickedPayload = {
	action: ACTION.CLICKED;
	actionSubject: ACTION_SUBJECT.BUTTON;
	actionSubjectId: ACTION_SUBJECT_ID.EDIT_DATASOURCE;
	attributes?: {
		appearance?: string;
		extensionKey?: string;
	};
	eventType: EVENT_TYPE.UI;
};
