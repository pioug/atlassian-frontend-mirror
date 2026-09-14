import React from 'react';

import { toggleBulletList, toggleOrderedList, tooltip } from '@atlaskit/editor-common/keymaps';
import { listMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import {
	ORDERED_LIST_MENU_ITEM,
	TEXT_FORMATTING_SECTION,
	UNORDERED_LIST_MENU_ITEM,
} from '@atlaskit/editor-common/quick-insert/keys';
import { TEXT_FORMATTING_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { ListPlugin } from '../../listPluginType';

import { ListQuickInsertMenuItem } from './ListQuickInsertMenuItem';

export const getListQuickInsertComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<ListPlugin> | undefined;
}): RegisterMenuItem[] =>
	[
		{ item: UNORDERED_LIST_MENU_ITEM, type: 'unordered' as const },
		{ item: ORDERED_LIST_MENU_ITEM, type: 'ordered' as const },
	].map(({ item, type }) => {
		const isOrdered = type === 'ordered';
		return {
			key: item.key,
			type: item.type,
			parents: [
				{
					key: TEXT_FORMATTING_SECTION.key,
					type: TEXT_FORMATTING_SECTION.type,
					rank: TEXT_FORMATTING_SECTION_RANK[item.key],
				},
			],
			match: createQuickInsertMatcher(({ formatMessage }) => ({
				description: formatMessage(
					isOrdered ? messages.orderedListDescription : messages.unorderedListDescription,
				),
				keywords: isOrdered ? ['ol', 'ordered'] : ['ul', 'unordered'],
				shortcut: tooltip(isOrdered ? toggleOrderedList : toggleBulletList),
				title: formatMessage(isOrdered ? messages.orderedList : messages.unorderedList),
			})),
			component: () => <ListQuickInsertMenuItem api={api} type={type} />,
		};
	});
