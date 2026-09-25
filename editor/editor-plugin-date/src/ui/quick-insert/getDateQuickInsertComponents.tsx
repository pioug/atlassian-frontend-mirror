import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { DATE_MENU_ITEM, STRUCTURE_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { DatePlugin } from '../../datePluginType';
import { DateQuickInsertMenuItem } from './DateQuickInsertMenuItem';

const previewImageUrls = {
	light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVNK.png',
	dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVJO.png',
};

export const getDateQuickInsertComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<DatePlugin> | undefined;
}): RegisterMenuItem[] => [
	{
		key: DATE_MENU_ITEM.key,
		type: DATE_MENU_ITEM.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[DATE_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.dateDescription),
			keywords: ['calendar', 'day', 'time', 'today', '/'],
			shortcut: '//',
			title: formatMessage(messages.date),
		})),
		component: () => <DateQuickInsertMenuItem api={api} previewImageUrls={previewImageUrls} />,
	},
];
