import React from 'react';

import {
	INSERT_BLOCK_SECTION,
	INSERT_BLOCK_SECTION_RANK,
	OVERFLOW_MENU,
	OVERFLOW_MENU_RANK,
	SYNCED_BLOCK_BUTTON,
	SYNCED_BLOCK_GROUP,
	SYNCED_BLOCK_ITEM,
	SYNCED_BLOCK_SECTION,
	SYNCED_BLOCK_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

import { CreateSyncedBlockButton } from './CreateSyncedBlockButton';
import { CreateSyncedBlockItem } from './CreateSyncedBlockItem';
import { OverflowMenuSection } from './OverflowMenuSection';

const SYNCED_BLOCK_OVERFLOW_MENU_SECTION = {
	type: SYNCED_BLOCK_SECTION.type,
	key: SYNCED_BLOCK_SECTION.key,
	parents: [
		{
			type: OVERFLOW_MENU.type,
			key: OVERFLOW_MENU.key,
			rank: OVERFLOW_MENU_RANK[SYNCED_BLOCK_SECTION.key],
		},
	],
	component: ({ children }: { children: React.ReactNode }) => {
		return <OverflowMenuSection>{children}</OverflowMenuSection>;
	},
};

const SYNCED_BLOCK_PRIMARY_TOOLBAR_GROUP = {
	type: SYNCED_BLOCK_GROUP.type,
	key: SYNCED_BLOCK_GROUP.key,
	parents: [
		{
			type: INSERT_BLOCK_SECTION.type,
			key: INSERT_BLOCK_SECTION.key,
			rank: INSERT_BLOCK_SECTION_RANK[SYNCED_BLOCK_GROUP.key],
		},
	],
};

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
): RegisterComponent[] => {
	return [
		SYNCED_BLOCK_PRIMARY_TOOLBAR_GROUP,
		SYNCED_BLOCK_OVERFLOW_MENU_SECTION,
		{
			type: SYNCED_BLOCK_BUTTON.type,
			key: SYNCED_BLOCK_BUTTON.key,
			component: () => <CreateSyncedBlockButton api={api} />,
			parents: [
				{
					type: SYNCED_BLOCK_GROUP.type,
					key: SYNCED_BLOCK_GROUP.key,
					rank: SYNCED_BLOCK_SECTION_RANK[SYNCED_BLOCK_BUTTON.key],
				},
			],
		},
		{
			type: SYNCED_BLOCK_ITEM.type,
			key: SYNCED_BLOCK_ITEM.key,
			parents: [
				{
					type: SYNCED_BLOCK_SECTION.type,
					key: SYNCED_BLOCK_SECTION.key,
					rank: SYNCED_BLOCK_SECTION_RANK[SYNCED_BLOCK_ITEM.key],
				},
			],
			component: () => {
				return <CreateSyncedBlockItem api={api} />;
			},
		},
	];
};
