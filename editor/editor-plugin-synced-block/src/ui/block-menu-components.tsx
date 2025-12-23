import React from 'react';

import {
	BLOCK_ACTIONS_MENU_SECTION,
	BLOCK_ACTIONS_MENU_SECTION_RANK,
	BLOCK_ACTIONS_CREATE_SYNCED_BLOCK_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

import { CreateOrCopySyncedBlockDropdownItem } from './CreateSyncedBlockDropdownItem';

export const getBlockMenuComponents = (
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	enableSourceSyncedBlockCreation: boolean,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item' as const,
			key: BLOCK_ACTIONS_CREATE_SYNCED_BLOCK_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section',
				key: BLOCK_ACTIONS_MENU_SECTION.key,
				rank: BLOCK_ACTIONS_MENU_SECTION_RANK[BLOCK_ACTIONS_CREATE_SYNCED_BLOCK_MENU_ITEM.key],
			},
			component: () => (
				<CreateOrCopySyncedBlockDropdownItem
					api={api}
					enableSourceSyncedBlockCreation={enableSourceSyncedBlockCreation}
				/>
			),
		},
	];
};
