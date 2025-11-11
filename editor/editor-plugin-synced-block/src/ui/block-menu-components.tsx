import React from 'react';

import {
	ADD_BLOCKS_MENU_SECTION,
	ADD_BLOCKS_MENU_SECTION_RANK,
	CREATE_SYNCED_BLOCK_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

import { CreateOrCopySyncedBlockDropdownItem } from './CreateSyncedBlockDropdownItem';

export const getBlockMenuComponents = (
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item' as const,
			key: CREATE_SYNCED_BLOCK_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section',
				key: ADD_BLOCKS_MENU_SECTION.key,
				rank: ADD_BLOCKS_MENU_SECTION_RANK[CREATE_SYNCED_BLOCK_MENU_ITEM.key],
			},
			component: () => <CreateOrCopySyncedBlockDropdownItem api={api} />,
		},
	];
};
