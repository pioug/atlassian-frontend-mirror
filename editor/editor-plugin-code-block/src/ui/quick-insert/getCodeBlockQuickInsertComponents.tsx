import React from 'react';

import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { CODE_BLOCK_MENU_ITEM, STRUCTURE_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { CodeBlockPlugin } from '../../codeBlockPluginType';

import { CodeBlockQuickInsertMenuItem } from './CodeBlockQuickInsertMenuItem';

const previewImageUrls = {
	light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/wtf74vgl71h0j84a742l84qly50mdeq2.png',
	dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/11t8334w2tk154543fv1l248n1he6173.png',
};

export const getCodeBlockQuickInsertComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<CodeBlockPlugin> | undefined;
}): RegisterMenuItem[] => [
	{
		key: CODE_BLOCK_MENU_ITEM.key,
		type: CODE_BLOCK_MENU_ITEM.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[CODE_BLOCK_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(blockTypeMessages.codeblockDescription),
			keywords: ['code block'],
			shortcut: '```',
			title: formatMessage(blockTypeMessages.codeblock),
		})),
		component: () => <CodeBlockQuickInsertMenuItem api={api} previewImageUrls={previewImageUrls} />,
	},
];
