import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	INSERT_MEDIA_VIA,
	MEDIA_INSERT_TAB,
} from '@atlaskit/editor-common/analytics';
import {
	DEFAULT_MEDIA_INSERT_TAB_RANK,
	MEDIA_INSERT_TAB_RANK,
} from '@atlaskit/editor-common/media-insert/rank';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconImages } from '@atlaskit/editor-common/quick-insert';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { MediaInsertPlugin, RegisterInsertTab } from './mediaInsertPluginType';
import { closeMediaInsertPicker, showMediaInsertPopup } from './pm-plugins/actions';
import { createPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import type { InsertExternalMediaSingle, InsertFile, InsertMediaSingle } from './types';
import { MediaInsertPicker } from './ui/MediaInsertPicker';
import { getMediaInsertQuickInsertComponents } from './ui/quick-insert/getMediaInsertQuickInsertComponents';

const getInitialMediaInsertTab = (
	registeredTabs: RegisterInsertTab[],
	isOnlyExternalLinks?: boolean,
): MEDIA_INSERT_TAB => {
	const initialBuiltInTab = isOnlyExternalLinks ? MEDIA_INSERT_TAB.LINK : MEDIA_INSERT_TAB.UPLOAD;
	const initialBuiltInRank = isOnlyExternalLinks
		? MEDIA_INSERT_TAB_RANK[MEDIA_INSERT_TAB.LINK]
		: MEDIA_INSERT_TAB_RANK[MEDIA_INSERT_TAB.UPLOAD];
	const firstRegisteredTab = registeredTabs.reduce<RegisterInsertTab | undefined>(
		(firstTab, tab) =>
			!firstTab ||
			(tab.rank ?? DEFAULT_MEDIA_INSERT_TAB_RANK) < (firstTab.rank ?? DEFAULT_MEDIA_INSERT_TAB_RANK)
				? tab
				: firstTab,
		undefined,
	);
	if (
		firstRegisteredTab &&
		(firstRegisteredTab.rank ?? DEFAULT_MEDIA_INSERT_TAB_RANK) < initialBuiltInRank
	) {
		return firstRegisteredTab.key as MEDIA_INSERT_TAB;
	}

	return initialBuiltInTab;
};

/**
 * Per-editor-instance registry of insert tabs registered via
 * `actions.registerInsertTab(...)`. Idempotent on `key` so that re-registering
 * the same tab (e.g. on plugin re-init in dev / StrictMode) replaces rather
 * than duplicates.
 */
const createInsertTabRegistry = (): {
	getAll: () => RegisterInsertTab[];
	register: (tab: RegisterInsertTab) => void;
} => {
	const tabs: RegisterInsertTab[] = [];
	return {
		register: (tab) => {
			const existingIndex = tabs.findIndex((t) => t.key === tab.key);
			if (existingIndex >= 0) {
				tabs[existingIndex] = tab;
			} else {
				tabs.push(tab);
			}
		},
		getAll: () => tabs,
	};
};

export const mediaInsertPlugin: MediaInsertPlugin = ({ api, config }) => {
	const insertTabRegistry = createInsertTabRegistry();
	const isRegisteredSlashCommandEnabled = isExperimentEnabled('platform_editor_slash_command');
	if (isRegisteredSlashCommandEnabled) {
		api?.uiControlRegistry?.actions.register(getMediaInsertQuickInsertComponents({ api, config }));
	}

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
			const { isOpen, mountInfo } = pluginKey.getState(editorState) || {};
			return {
				isOpen,
				mountInfo,
			};
		},

		commands: {
			showMediaInsertPopup:
				(mountInfo) =>
				({ tr }) =>
					showMediaInsertPopup(tr, mountInfo),
		},

		actions: {
			registerInsertTab: (tab) => insertTabRegistry.register(tab),
			getInsertTabs: () => insertTabRegistry.getAll(),
		},

		contentComponent: ({
			editorView,
			dispatchAnalyticsEvent,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
		}) => {
			if (!editorView) {
				return null;
			}

			const insertMediaSingle: InsertMediaSingle = ({ mediaState, inputMethod }) => {
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
						INSERT_MEDIA_VIA.EXTERNAL_UPLOAD,
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
						INSERT_MEDIA_VIA.EXTERNAL_URL,
					) ?? false
				);
			};

			const insertFile: InsertFile = ({ mediaState, inputMethod, onMediaStateChanged }) => {
				const collection = mediaState.collection;
				return collection !== undefined
					? (api?.media.sharedState
							.currentState()
							?.insertFile(
								mediaState,
								onMediaStateChanged,
								inputMethod,
								INSERT_MEDIA_VIA.LOCAL_UPLOAD,
							) ?? false)
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
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
					closeMediaInsertPicker={() =>
						editorView.dispatch(closeMediaInsertPicker(editorView.state.tr))
					}
					insertMediaSingle={insertMediaSingle}
					insertExternalMediaSingle={insertExternalMediaSingle}
					insertFile={insertFile}
					isOnlyExternalLinks={config?.isOnlyExternalLinks}
					customizedUrlValidation={config?.customizedUrlValidation}
					customizedHelperMessage={config?.customizedHelperMessage}
				/>
			);
		},

		pluginsOptions: isRegisteredSlashCommandEnabled
			? {}
			: {
					quickInsert: ({ formatMessage }) => [
						{
							id: 'media-insert',
							title: formatMessage(messages.mediaFiles),
							description: formatMessage(messages.mediaFilesDescription),
							priority: 400,
							keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video', 'file'],
							icon: () => <IconImages />,
							isDisabledOffline: true,
							action(insert) {
								// Insert empty string to remove the typeahead raw text
								// close the quick insert immediately
								const tr = insert('');
								api?.mediaInsert.commands.showMediaInsertPopup()({ tr });

								api?.analytics?.actions?.attachAnalyticsEvent({
									action: ACTION.OPENED,
									actionSubject: ACTION_SUBJECT.PICKER,
									actionSubjectId: ACTION_SUBJECT_ID.PICKER_MEDIA,
									attributes: {
										inputMethod: INPUT_METHOD.QUICK_INSERT,
										openedTab: getInitialMediaInsertTab(
											insertTabRegistry.getAll(),
											config?.isOnlyExternalLinks,
										),
									},
									eventType: EVENT_TYPE.UI,
								})(tr);

								return tr;
							},
						},
					],
				},
	};
};
