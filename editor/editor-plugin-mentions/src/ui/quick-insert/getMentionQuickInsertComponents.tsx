import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { MENTION_MENU_ITEM, STRUCTURE_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { TypeAheadHandler } from '@atlaskit/editor-plugin-type-ahead';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { MentionsPlugin } from '../../mentionsPluginType';

import { MentionQuickInsertMenuItem } from './MentionQuickInsertMenuItem';

export const getMentionQuickInsertComponents = ({
	api,
	typeAhead,
}: {
	api: ExtractInjectionAPI<MentionsPlugin> | undefined;
	typeAhead: TypeAheadHandler;
}): RegisterMenuItem[] => [
	{
		key: MENTION_MENU_ITEM.key,
		type: MENTION_MENU_ITEM.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[MENTION_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.mentionDescription),
			keywords: ['team', 'user'],
			shortcut: '@',
			title: formatMessage(messages.mention),
		})),
		component: () => <MentionQuickInsertMenuItem api={api} typeAhead={typeAhead} />,
	},
];
