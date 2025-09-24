import React from 'react';

import { syncBlock } from '@atlaskit/adf-schema';
import type { QuickInsertActionInsert } from '@atlaskit/editor-common/provider-factory';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/dist/types/state';
import { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import SmartLinkIcon from '@atlaskit/icon/core/smart-link';

import { createSyncedBlock } from './pm-plugins/actions';
import { createPlugin } from './pm-plugins/main';
import type { SyncedBlockPlugin } from './syncedBlockPluginType';
import { ContentComponent } from './ui/ContentComponent';
import { getToolbarConfig } from './ui/floating-toolbar';

export const syncedBlockPlugin: SyncedBlockPlugin = ({ config, api }) => {
	const syncBlockStore = new SyncBlockStoreManager(config?.dataProvider);

	return {
		name: 'syncedBlock',

		nodes() {
			return [
				{
					name: 'syncBlock',
					node: syncBlock,
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
		pluginsOptions: {
			quickInsert: () => [
				{
					id: 'syncBlock',
					title: 'Synced Block',
					description: 'Create a synced block',
					priority: 800,
					keywords: ['synced', 'block', 'synced-block', 'sync', 'sync-block'],
					keyshortcut: '',
					icon: () => <SmartLinkIcon label="Synced Block" />,
					action: (_insert: QuickInsertActionInsert, state: EditorState) => {
						return createSyncedBlock(state);
					},
				},
			],
			floatingToolbar: (state, intl, providerFactory) =>
				getToolbarConfig(state, intl, config, providerFactory),
		},

		contentComponent: () => {
			return <ContentComponent syncBlockStoreManager={syncBlockStore} />;
		},
	};
};
