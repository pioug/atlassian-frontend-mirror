import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '../analytics';
import { ACTION, ACTION_SUBJECT, type ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics';

export const getDomRefFromSelection = (
	view: EditorView,
	actionSubjectId:
		| ACTION_SUBJECT_ID.PICKER_MEDIA
		| ACTION_SUBJECT_ID.PICKER_TABLE_SIZE
		| ACTION_SUBJECT_ID.PICKER_EMOJI,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
) => {
	try {
		const domRef = findDomRefAtPos(view.state.selection.from, view.domAtPos.bind(view));
		if (domRef instanceof HTMLElement) {
			// If element is not a paragraph, we need to find the closest paragraph parent
			if (domRef.nodeName !== 'P') {
				const paragraphRef = domRef.closest('p');
				if (paragraphRef) {
					return paragraphRef;
				}
			}
			return domRef;
		} else {
			throw new Error('Invalid DOM reference');
		}
	} catch (error: unknown) {
		if (editorAnalyticsAPI) {
			const payload: AnalyticsEventPayload = {
				action: ACTION.ERRORED,
				actionSubject: ACTION_SUBJECT.PICKER,
				actionSubjectId: actionSubjectId,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					error: 'Error getting DOM reference from selection',
				},
			};
			editorAnalyticsAPI.fireAnalyticsEvent(payload);
		}
	}
};
