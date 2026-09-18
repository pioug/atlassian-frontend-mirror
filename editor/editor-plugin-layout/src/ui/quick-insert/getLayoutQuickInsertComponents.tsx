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
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0iw817624sqeag4khc1xcy63873q21rq.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/54ofhg00x870clknn4332akh40g8u3w2.png',
		},
		title: layoutMessages.twoColumnsAdvancedLayout,
	},
	{
		columnCount: 3 as const,
		description: messages.columnsDescriptionAdvancedLayout,
		item: THREE_COLUMNS_LAYOUT_MENU_ITEM,
		keyword: 'three column',
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/jly0ydm2oi818u507kt807jsi54du81d.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/12qobcpeyt16r8coi03arj643b7oq780.png',
		},
		title: layoutMessages.threeColumnsAdvancedLayout,
	},
	{
		columnCount: 4 as const,
		description: messages.columnsDescriptionAdvancedLayout,
		item: FOUR_COLUMNS_LAYOUT_MENU_ITEM,
		keyword: 'four column',
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/qxypnub871i55c81u236hb736y4008d7.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/7t6ryd4ek4gob4634vr4u31m0l4760el.png',
		},
		title: layoutMessages.fourColumns,
	},
	{
		columnCount: 5 as const,
		description: messages.columnsDescriptionAdvancedLayout,
		item: FIVE_COLUMNS_LAYOUT_MENU_ITEM,
		keyword: 'five column',
		previewImageUrls: {
			light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/10ffd735631hbf21r5lr4dophlp6702a.png',
			dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/ma21tr7mfw721t0tr31n80j33g032b78.png',
		},
		title: layoutMessages.fiveColumns,
	},
];

export const getLayoutQuickInsertComponents = ({ api }: Params): RegisterMenuItem[] =>
	layoutItems.map(({ columnCount, description, item, keyword, previewImageUrls, title }) => ({
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
			<LayoutQuickInsertMenuItem
				api={api}
				columnCount={columnCount}
				previewImageUrls={previewImageUrls}
				title={title}
			/>
		),
	}));
