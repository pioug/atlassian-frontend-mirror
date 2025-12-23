import React from 'react';

import { bodiedSyncBlock, syncBlock } from '@atlaskit/adf-schema';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { QuickInsertActionInsert } from '@atlaskit/editor-common/provider-factory';
import { IconSyncBlock } from '@atlaskit/editor-common/quick-insert';
import type { EditorCommand, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import Lozenge from '@atlaskit/lozenge';

import { flushBodiedSyncBlocks, flushSyncBlocks } from './editor-actions';
import {
	copySyncedBlockReferenceToClipboardEditorCommand,
	createSyncedBlock,
} from './editor-commands';
import { createPlugin, syncedBlockPluginKey } from './pm-plugins/main';
import type { SyncedBlockPlugin } from './syncedBlockPluginType';
import type { SyncedBlockSharedState } from './types';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { DeleteConfirmationModal } from './ui/DeleteConfirmationModal';
import { Flag } from './ui/Flag';
import { getToolbarConfig } from './ui/floating-toolbar';
import { SyncBlockRefresher } from './ui/SyncBlockRefresher';
import { getToolbarComponents } from './ui/toolbar-components';

export const syncedBlockPlugin: SyncedBlockPlugin = ({ config, api }) => {
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
			];
		},

		commands: {
			copySyncedBlockReferenceToClipboard: (): EditorCommand =>
				copySyncedBlockReferenceToClipboardEditorCommand(syncBlockStore, api),
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
			quickInsert: ({ formatMessage }) => {
				if (!config?.enableSourceCreation) {
					return [];
				}

				return [
					{
						id: 'syncBlock',
						title: formatMessage(blockTypeMessages.syncedBlock),
						description: formatMessage(blockTypeMessages.syncedBlockDescription),
						priority: 800,
						keywords: [
							'synced',
							'block',
							'synced-block',
							'sync',
							'sync-block',
							'auto',
							'update',
							'excerpt',
							'connect',
						],
						isDisabledOffline: true,
						keyshortcut: '',
						lozenge: (
							<Lozenge appearance="new">{formatMessage(blockTypeMessages.newLozenge)}</Lozenge>
						),
						icon: () => <IconSyncBlock label={formatMessage(blockTypeMessages.syncedBlock)} />,
						action: (insert: QuickInsertActionInsert, state: EditorState) => {
							return createSyncedBlock({
								tr: state.tr,
								syncBlockStore,
								typeAheadInsert: insert,
							});
						},
					},
				];
			},
			floatingToolbar: (state, intl) => getToolbarConfig(state, intl, api, syncBlockStore),
		},

		contentComponent: () => {
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
			} = syncedBlockPluginKey.getState(editorState);
			return {
				activeFlag,
				syncBlockStore: currentSyncBlockStore,
				bodiedSyncBlockDeletionStatus,
			};
		},
	};
};
