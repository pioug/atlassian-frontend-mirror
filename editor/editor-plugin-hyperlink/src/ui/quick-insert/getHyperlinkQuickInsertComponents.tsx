import React from 'react';

import { addLink, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { HYPERLINK_MENU_ITEM, MEDIA_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { MEDIA_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { HyperlinkPlugin } from '../../hyperlinkPluginType';

import { HyperlinkQuickInsertMenuItem } from './HyperlinkQuickInsertMenuItem';

export const getHyperlinkQuickInsertComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<HyperlinkPlugin> | undefined;
}): RegisterMenuItem[] => [
	{
		key: HYPERLINK_MENU_ITEM.key,
		type: HYPERLINK_MENU_ITEM.type,
		parents: [
			{
				key: MEDIA_SECTION.key,
				type: MEDIA_SECTION.type,
				rank: MEDIA_SECTION_RANK[HYPERLINK_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.linkDescription),
			keywords: ['hyperlink', 'url'],
			shortcut: tooltip(addLink),
			title: formatMessage(messages.link),
		})),
		component: () => <HyperlinkQuickInsertMenuItem api={api} />,
	},
];
