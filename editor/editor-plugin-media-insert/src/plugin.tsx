import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	INSERT_MEDIA_VIA,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconImages } from '@atlaskit/editor-common/quick-insert';
import { fg } from '@atlaskit/platform-feature-flags';

import { closeMediaInsertPicker, showMediaInsertPopup } from './actions';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import type {
	InsertExternalMediaSingle,
	InsertFile,
	InsertMediaSingle,
	MediaInsertPlugin,
} from './types';
import { MediaInsertPicker } from './ui/MediaInsertPicker';

export const mediaInsertPlugin: MediaInsertPlugin = ({ api }) => {
	const isNestingInQuoteSupported =
		api?.featureFlags?.sharedState.currentState()?.nestMediaAndCodeblockInQuote ||
		fg('editor_nest_media_and_codeblock_in_quotes_jira');

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
			const { isOpen, target } = pluginKey.getState(editorState) || {};
			return {
				isOpen,
				target,
			};
		},

		commands: {
			showMediaInsertPopup:
				(target) =>
				({ tr }) =>
					showMediaInsertPopup(tr, target),
		},

		contentComponent: ({
			editorView,
			dispatchAnalyticsEvent,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
		}) => {
			const insertMediaSingle: InsertMediaSingle = ({
				mediaState,
				inputMethod,
				insertMediaVia,
			}) => {
				const { id, dimensions, contextId, scaleFactor = 1, fileName, collection } = mediaState;
				const { width, height } = dimensions || {
					height: undefined,
					width: undefined,
				};
				const scaledWidth = width && Math.round(width / scaleFactor);
				const node = editorView.state.schema.nodes.media.create({
					id,
					type: 'file',
					collection,
					contextId,
					width: scaledWidth,
					height: height && Math.round(height / scaleFactor),
					alt: fileName,
					__fileMimeType: mediaState.fileMimeType,
				});

				return (
					api?.media.actions.insertMediaAsMediaSingle(
						editorView,
						node,
						inputMethod,
						isNestingInQuoteSupported,
						insertMediaVia,
					) ?? false
				);
			};

			const insertExternalMediaSingle: InsertExternalMediaSingle = ({ url, alt, inputMethod }) => {
				const node = editorView.state.schema.nodes.media.create({
					type: 'external',
					url,
					alt,
					__external: true,
				});

				return (
					api?.media.actions.insertMediaAsMediaSingle(
						editorView,
						node,
						inputMethod,
						isNestingInQuoteSupported,
						INSERT_MEDIA_VIA.EXTERNAL_URL,
					) ?? false
				);
			};

			const insertFile: InsertFile = ({ mediaState, inputMethod, onMediaStateChanged }) => {
				const collection = mediaState.collection;
				return collection !== undefined
					? api?.media.sharedState
							.currentState()
							?.insertFile(
								mediaState,
								onMediaStateChanged,
								inputMethod,
								INSERT_MEDIA_VIA.LOCAL_UPLOAD,
							) ?? false
					: false;
			};

			return (
				<MediaInsertPicker
					api={api}
					editorView={editorView}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					popupsMountPoint={popupsMountPoint}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsScrollableElement={popupsScrollableElement}
					closeMediaInsertPicker={() =>
						editorView.dispatch(closeMediaInsertPicker(editorView.state.tr))
					}
					insertMediaSingle={insertMediaSingle}
					insertExternalMediaSingle={insertExternalMediaSingle}
					insertFile={insertFile}
				/>
			);
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'media-insert',
					title: formatMessage(messages.mediaFiles),
					description: formatMessage(messages.mediaFilesDescription),
					priority: 400,
					keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video', 'file'],
					icon: () => <IconImages />,
					action(insert) {
						// Insert empty string to remove the typeahead raw text
						// close the quick insert immediately
						const tr = insert('');
						api?.mediaInsert.commands.showMediaInsertPopup()({ tr });

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
