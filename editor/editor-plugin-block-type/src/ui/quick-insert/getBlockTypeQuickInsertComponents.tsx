import React from 'react';

import { blockTypeMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import {
	BLOCKQUOTE_MENU_ITEM,
	HEADING_1_MENU_ITEM,
	HEADING_2_MENU_ITEM,
	HEADING_3_MENU_ITEM,
	HEADING_4_MENU_ITEM,
	HEADING_5_MENU_ITEM,
	HEADING_6_MENU_ITEM,
	TEXT_FORMATTING_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
import { TEXT_FORMATTING_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI, HeadingLevels } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { BlockTypePlugin } from '../../blockTypePluginType';

import {
	BlockTypeQuickInsertMenuItem,
	getHeadingQuickInsertMessages,
	getHeadingQuickInsertShortcut,
} from './BlockTypeQuickInsertMenuItem';

type Params = {
	api: ExtractInjectionAPI<BlockTypePlugin> | undefined;
	exclude: readonly string[];
};

const headingItems = [
	{ item: HEADING_1_MENU_ITEM, level: 1 },
	{ item: HEADING_2_MENU_ITEM, level: 2 },
	{ item: HEADING_3_MENU_ITEM, level: 3 },
	{ item: HEADING_4_MENU_ITEM, level: 4 },
	{ item: HEADING_5_MENU_ITEM, level: 5 },
	{ item: HEADING_6_MENU_ITEM, level: 6 },
] as const satisfies ReadonlyArray<{ item: unknown; level: HeadingLevels }>;

const getParent = (key: string) => [
	{
		key: TEXT_FORMATTING_SECTION.key,
		type: TEXT_FORMATTING_SECTION.type,
		rank: TEXT_FORMATTING_SECTION_RANK[key],
	},
];

export const getBlockTypeQuickInsertComponents = ({ api, exclude }: Params): RegisterMenuItem[] => [
	...headingItems
		.filter(() => !exclude.includes('heading'))
		.map(({ item, level: headingLevel }) => {
			const headingMessages = getHeadingQuickInsertMessages(headingLevel);

			return {
				key: item.key,
				type: item.type,
				parents: getParent(item.key),
				match: createQuickInsertMatcher(({ formatMessage }) => ({
					description: formatMessage(headingMessages.description),
					keywords: [`h${headingLevel}`],
					shortcut: getHeadingQuickInsertShortcut(headingLevel),
					title: formatMessage(headingMessages.title),
				})),
				component: () => <BlockTypeQuickInsertMenuItem api={api} item={headingLevel} />,
			};
		}),
	...(!exclude.includes('blockquote')
		? [
				{
					key: BLOCKQUOTE_MENU_ITEM.key,
					type: BLOCKQUOTE_MENU_ITEM.type,
					parents: getParent(BLOCKQUOTE_MENU_ITEM.key),
					match: createQuickInsertMatcher(({ formatMessage }) => ({
						description: formatMessage(messages.blockquoteDescription),
						shortcut: '>',
						title: formatMessage(messages.blockquote),
					})),
					component: () => <BlockTypeQuickInsertMenuItem api={api} item="blockquote" />,
				},
			]
		: []),
];
