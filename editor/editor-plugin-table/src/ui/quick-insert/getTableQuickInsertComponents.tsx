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
			/>
		),
	},
];
