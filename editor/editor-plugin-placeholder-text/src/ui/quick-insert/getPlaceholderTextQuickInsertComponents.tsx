import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import {
	PLACEHOLDER_TEXT_MENU_ITEM,
	TEXT_FORMATTING_SECTION,
} from '@atlaskit/editor-common/quick-insert/keys';
import { TEXT_FORMATTING_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { PlaceholderTextPlugin } from '../../placeholderTextPluginType';
import { PlaceholderTextQuickInsertMenuItem } from './PlaceholderTextQuickInsertMenuItem';

export const getPlaceholderTextQuickInsertComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<PlaceholderTextPlugin> | undefined;
}): RegisterMenuItem[] => [
	{
		key: PLACEHOLDER_TEXT_MENU_ITEM.key,
		type: PLACEHOLDER_TEXT_MENU_ITEM.type,
		parents: [
			{
				key: TEXT_FORMATTING_SECTION.key,
				type: TEXT_FORMATTING_SECTION.type,
				rank: TEXT_FORMATTING_SECTION_RANK[PLACEHOLDER_TEXT_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.placeholderTextDescription),
			keywords: ['placeholder'],
			title: formatMessage(messages.placeholderText),
		})),
		component: () => <PlaceholderTextQuickInsertMenuItem api={api} />,
	},
];
