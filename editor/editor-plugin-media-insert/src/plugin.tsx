import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconImages } from '@atlaskit/editor-common/quick-insert';

import { closeMediaInsertPicker, showMediaInsertPopup } from './actions';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import type { MediaInsertPlugin } from './types';
import { MediaInsertPicker } from './ui/MediaInsertPicker';

export const mediaInsertPlugin: MediaInsertPlugin = ({ api }) => {
	return {
		name: 'mediaInsert',

		pmPlugins() {
			return [
				{
					name: 'mediaInsert',
					plugin: () => createPlugin(),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return {
					isOpen: false,
				};
			}
			const { isOpen } = pluginKey.getState(editorState) || {};
			return {
				isOpen,
			};
		},

		contentComponent: ({
			editorView,
			dispatchAnalyticsEvent,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
		}) => {
			const { dispatch, state } = editorView;
			return (
				<MediaInsertPicker
					api={api}
					editorView={editorView}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					popupsMountPoint={popupsMountPoint}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsScrollableElement={popupsScrollableElement}
					closeMediaInsertPicker={() => dispatch(closeMediaInsertPicker(state.tr))}
				/>
			);
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'media-insert',
					title: formatMessage(messages.insertMediaFromUrl),
					description: formatMessage(messages.insertMediaFromUrlDescription),
					priority: 400,
					keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video'],
					icon: () => <IconImages />,
					action(insert) {
						// Insert empty string to remove the typeahead raw text
						// close the quick insert immediately
						const tr = insert('');
						showMediaInsertPopup(tr);

						api?.analytics?.actions?.attachAnalyticsEvent({
							action: ACTION.OPENED,
							actionSubject: ACTION_SUBJECT.PICKER,
							actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
							attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
							eventType: EVENT_TYPE.UI,
						})(tr);

						return tr;
					},
				},
			],
		},
	};
};
