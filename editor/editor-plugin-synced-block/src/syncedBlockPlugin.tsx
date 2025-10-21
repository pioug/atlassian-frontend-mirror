import React from 'react';

import { bodiedSyncBlock, syncBlock } from '@atlaskit/adf-schema';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { QuickInsertActionInsert } from '@atlaskit/editor-common/provider-factory';
import { IconSyncBlock } from '@atlaskit/editor-common/quick-insert';
import type { EditorCommand, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import { createSyncedBlock } from './pm-plugins/actions';
import { createPlugin } from './pm-plugins/main';
import type { SyncedBlockPlugin } from './syncedBlockPluginType';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { ContentComponent } from './ui/ContentComponent';
import { getToolbarConfig } from './ui/floating-toolbar';

export const syncedBlockPlugin: SyncedBlockPlugin = ({ config, api }) => {
	const syncBlockStore = new SyncBlockStoreManager(config?.dataProvider);

	api?.blockMenu?.actions.registerBlockMenuComponents(getBlockMenuComponents(api));

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
			insertSyncedBlock:
				(): EditorCommand =>
				({ tr }) =>
					createSyncedBlock({
						tr,
						syncBlockStore,
					}) || null,
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
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
					keyshortcut: '',
					icon: () => <IconSyncBlock label={formatMessage(blockTypeMessages.syncedBlock)} />,
					action: (insert: QuickInsertActionInsert, state: EditorState) => {
						return createSyncedBlock({
							tr: state.tr,
							syncBlockStore,
							typeAheadInsert: insert,
						});
					},
				},
			],
			floatingToolbar: (state, intl, providerFactory) =>
				getToolbarConfig(state, intl, config, providerFactory, api, syncBlockStore),
		},

		contentComponent: () => {
			return <ContentComponent syncBlockStoreManager={syncBlockStore} />;
		},
	};
};
