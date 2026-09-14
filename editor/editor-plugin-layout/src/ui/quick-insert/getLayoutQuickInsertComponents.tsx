import React from 'react';

import {
	layoutMessages,
	toolbarInsertBlockMessages as messages,
} from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import {
	FIVE_COLUMNS_LAYOUT_MENU_ITEM,
	FOUR_COLUMNS_LAYOUT_MENU_ITEM,
	STRUCTURE_SECTION,
	THREE_COLUMNS_LAYOUT_MENU_ITEM,
	TWO_COLUMNS_LAYOUT_MENU_ITEM,
} from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { LayoutPlugin } from '../../layoutPluginType';

import { LayoutQuickInsertMenuItem } from './LayoutQuickInsertMenuItem';

type Params = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

const layoutItems = [
	{
		columnCount: 2 as const,
		description: messages.columnsDescriptionAdvancedLayout,
		item: TWO_COLUMNS_LAYOUT_MENU_ITEM,
		keyword: 'two column',
		title: layoutMessages.twoColumnsAdvancedLayout,
	},
	{
		columnCount: 3 as const,
		description: messages.columnsDescriptionAdvancedLayout,
		item: THREE_COLUMNS_LAYOUT_MENU_ITEM,
		keyword: 'three column',
		title: layoutMessages.threeColumnsAdvancedLayout,
	},
	{
		columnCount: 4 as const,
		description: messages.columnsDescriptionAdvancedLayout,
		item: FOUR_COLUMNS_LAYOUT_MENU_ITEM,
		keyword: 'four column',
		title: layoutMessages.fourColumns,
	},
	{
		columnCount: 5 as const,
		description: messages.columnsDescriptionAdvancedLayout,
		item: FIVE_COLUMNS_LAYOUT_MENU_ITEM,
		keyword: 'five column',
		title: layoutMessages.fiveColumns,
	},
];

export const getLayoutQuickInsertComponents = ({ api }: Params): RegisterMenuItem[] =>
	layoutItems.map(({ columnCount, description, item, keyword, title }) => ({
		key: item.key,
		type: item.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[item.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(description, {
				numberOfColumns: ['one', 'two', 'three', 'four', 'five'][columnCount - 1],
			}),
			keywords: ['layout', 'column', 'section', 'col', keyword],
			title: formatMessage(title),
		})),
		component: () => (
			<LayoutQuickInsertMenuItem api={api} columnCount={columnCount} title={title} />
		),
	}));
