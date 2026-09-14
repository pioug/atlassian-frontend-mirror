import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { EMOJI_MENU_ITEM, MEDIA_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { MEDIA_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import { EmojiQuickInsertMenuItem } from './EmojiQuickInsertMenuItem';

export const getEmojiQuickInsertComponents = (): RegisterMenuItem[] => [
	{
		key: EMOJI_MENU_ITEM.key,
		type: EMOJI_MENU_ITEM.type,
		parents: [
			{
				key: MEDIA_SECTION.key,
				type: MEDIA_SECTION.type,
				rank: MEDIA_SECTION_RANK[EMOJI_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.emojiDescription),
			shortcut: ':',
			title: formatMessage(messages.emoji),
		})),
		component: EmojiQuickInsertMenuItem,
	},
];
