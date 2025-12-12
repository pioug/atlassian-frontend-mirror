import React from 'react';

import {
	INSERT_BLOCK_SECTION,
	INSERT_BLOCK_SECTION_RANK,
	SYNCED_BLOCK_BUTTON,
	SYNCED_BLOCK_GROUP,
	SYNCED_BLOCK_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { Show, ToolbarButtonGroup } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

import { CreateSyncedBlockButton } from './CreateSyncedBlockButton';

const SYNCED_BLOCK_PRIMARY_TOOLBAR_GROUP = {
	type: SYNCED_BLOCK_GROUP.type,
	key: SYNCED_BLOCK_GROUP.key,
	component: expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
		? ({ children }: { children: React.ReactNode }) => (
				<Show above="md">
					<ToolbarButtonGroup>{children}</ToolbarButtonGroup>
				</Show>
			)
		: undefined,
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
	];
};
