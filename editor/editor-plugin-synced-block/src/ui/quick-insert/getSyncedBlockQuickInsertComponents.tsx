import React from 'react';

import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import {
	STRUCTURE_SECTION,
	SYNCED_BLOCK_MENU_ITEM,
} from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { SyncedBlockPlugin } from '../../syncedBlockPluginType';

import { SyncedBlockQuickInsertMenuItem } from './SyncedBlockQuickInsertMenuItem';

export const getSyncedBlockQuickInsertComponents = ({
	api,
	syncBlockStore,
}: {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
	syncBlockStore: SyncBlockStoreManager;
}): RegisterMenuItem[] => [
	{
		key: SYNCED_BLOCK_MENU_ITEM.key,
		type: SYNCED_BLOCK_MENU_ITEM.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[SYNCED_BLOCK_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(blockTypeMessages.syncedBlockDescription),
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
				'create',
			],
			shortcut: '',
			title: formatMessage(blockTypeMessages.syncedBlockQuickInsertTitle),
		})),
		component: () => <SyncedBlockQuickInsertMenuItem api={api} syncBlockStore={syncBlockStore} />,
	},
];
