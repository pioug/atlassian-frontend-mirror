import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { EditorCommand } from '@atlaskit/editor-common/types';

export const openContextMenu =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	({
		button,
		altKey,
		ctrlKey,
		shiftKey,
		metaKey,
	}: {
		button: number;
		altKey: boolean;
		ctrlKey: boolean;
		shiftKey: boolean;
		metaKey: boolean;
	}): EditorCommand =>
	({ tr }) => {
		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.OPENED,
			actionSubject: ACTION_SUBJECT.CONTEXT_MENU,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				button,
				altKey,
				ctrlKey,
				shiftKey,
				metaKey,
			},
		})(tr);
		tr.setMeta('addToHistory', false);

		return tr;
	};
