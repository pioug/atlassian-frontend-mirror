import React from 'react';

import { bodiedSyncBlock, syncBlock } from '@atlaskit/adf-schema';
import type { EditorCommand, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import { flushBodiedSyncBlocks, flushSyncBlocks } from './editor-actions';
import {
	copySyncedBlockReferenceToClipboardEditorCommand,
	createSyncedBlock,
} from './editor-commands';
import { createPlugin, syncedBlockPluginKey } from './pm-plugins/main';
import { getMenuAndToolbarExperiencesPlugin } from './pm-plugins/menu-and-toolbar-experiences';
import type { SyncedBlockPlugin } from './syncedBlockPluginType';
import { type SyncedBlockSharedState } from './types';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { DeleteConfirmationModal } from './ui/DeleteConfirmationModal';
import { Flag } from './ui/Flag';
import { getToolbarConfig } from './ui/floating-toolbar';
import { getQuickInsertConfig } from './ui/quick-insert';
import { SyncBlockRefresher } from './ui/SyncBlockRefresher';
import { getToolbarComponents } from './ui/toolbar-components';

export const syncedBlockPlugin: SyncedBlockPlugin = ({ config, api }) => {
	const refs: {
		containerElement?: HTMLElement;
		popupsMountPoint?: HTMLElement;
		wrapperElement?: HTMLElement;
	} = {};

	const syncBlockStore = new SyncBlockStoreManager(config?.syncBlockDataProvider);
	syncBlockStore.setFireAnalyticsEvent(api?.analytics?.actions?.fireAnalyticsEvent);

	api?.blockMenu?.actions.registerBlockMenuComponents(
		getBlockMenuComponents(api, config?.enableSourceCreation ?? false),
	);
	api?.toolbar?.actions.registerComponents(
		getToolbarComponents(api, config?.enableSourceCreation ?? false),
	);

	return {
		name: 'syncedBlock',

		nodes() {
			return [
				{
					name: 'syncBlock',
					node: syncBlock,
				},
				{
					name: 'bodiedSyncBlock',
					node: bodiedSyncBlock,
				},
			];
		},

		pmPlugins() {
			return [
				{
					name: 'syncedBlockPlugin',
					plugin: (params: PMPluginFactoryParams) =>
						createPlugin(config, params, syncBlockStore, api),
				},
				{
					name: 'menuAndToolbarExperiencesPlugin',
					plugin: () =>
						getMenuAndToolbarExperiencesPlugin({
							refs,
							dispatchAnalyticsEvent: (payload) =>
								api?.analytics?.actions?.fireAnalyticsEvent(payload),
						}),
				},
			];
		},

		commands: {
			copySyncedBlockReferenceToClipboard: (inputMethod): EditorCommand =>
				copySyncedBlockReferenceToClipboardEditorCommand(syncBlockStore, inputMethod, api),
			insertSyncedBlock:
				(): EditorCommand =>
					({ tr }) => {
						if (!config?.enableSourceCreation) {
							return null;
						}

						return (
							createSyncedBlock({
								tr,
								syncBlockStore,
								fireAnalyticsEvent: api?.analytics?.actions.fireAnalyticsEvent,
							}) || null
						);
					},
		},

		actions: {
			flushBodiedSyncBlocks: () => {
				return flushBodiedSyncBlocks(syncBlockStore);
			},
			flushSyncedBlocks: () => {
				return flushSyncBlocks(syncBlockStore);
			},
		},

		pluginsOptions: {
			quickInsert: getQuickInsertConfig(config, api, syncBlockStore),
			floatingToolbar: (state, intl) => getToolbarConfig(state, intl, api, syncBlockStore),
		},

		contentComponent: ({ containerElement, wrapperElement, popupsMountPoint }) => {
			refs.containerElement = containerElement || undefined;
			refs.popupsMountPoint = popupsMountPoint || undefined;
			refs.wrapperElement = wrapperElement || undefined;

			return (
				<>
					<SyncBlockRefresher syncBlockStoreManager={syncBlockStore} api={api} />
					<DeleteConfirmationModal syncBlockStoreManager={syncBlockStore} api={api} />
					<Flag api={api} />
				</>
			);
		},

		getSharedState: (editorState?: EditorState): SyncedBlockSharedState | undefined => {
			if (!editorState) {
				return;
			}
			const {
				activeFlag,
				syncBlockStore: currentSyncBlockStore,
				bodiedSyncBlockDeletionStatus,
				retryCreationPosMap,
			} = syncedBlockPluginKey.getState(editorState);
			return {
				activeFlag,
				syncBlockStore: currentSyncBlockStore,
				bodiedSyncBlockDeletionStatus,
				retryCreationPosMap,
			};
		},
	};
};
