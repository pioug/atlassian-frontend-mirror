import React from 'react';

import { toggleTable, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { STRUCTURE_SECTION, TABLE_MENU_ITEM } from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { TablePlugin, TablePluginOptions } from '../../tablePluginType';
import { TableQuickInsertMenuItem } from './TableQuickInsertMenuItem';

const previewImageUrls = {
	light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/c4685o2hdf8w8hx14734ys157w642avq.png',
	dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/322886by55wu3q48pshv25v2b0568y4y.png',
};

type Params = {
	api: ExtractInjectionAPI<TablePlugin> | undefined;
	isTableSelectorEnabled: boolean | undefined;
	options: TablePluginOptions;
};

export const getTableQuickInsertComponents = ({
	api,
	isTableSelectorEnabled,
	options,
}: Params): RegisterMenuItem[] => [
	{
		...TABLE_MENU_ITEM,
		parents: [
			{
				...STRUCTURE_SECTION,
				rank: STRUCTURE_SECTION_RANK[TABLE_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.tableDescription),
			keywords: ['cell', 'table'],
			shortcut: tooltip(toggleTable),
			title: formatMessage(messages.table),
		})),
		component: () => (
			<TableQuickInsertMenuItem
				api={api}
				isTableSelectorEnabled={isTableSelectorEnabled}
				options={options}
				previewImageUrls={previewImageUrls}
			/>
		),
	},
];
