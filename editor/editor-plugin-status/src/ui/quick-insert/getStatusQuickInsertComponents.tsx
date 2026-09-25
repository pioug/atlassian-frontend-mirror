import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { STATUS_MENU_ITEM, STRUCTURE_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { StatusPlugin } from '../../statusPluginType';
import { StatusQuickInsertMenuItem } from './StatusQuickInsertMenuItem';

const previewImageUrls = {
	light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVKM.png',
	dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVH8.png',
};

export const getStatusQuickInsertComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<StatusPlugin> | undefined;
}): RegisterMenuItem[] => [
	{
		key: STATUS_MENU_ITEM.key,
		type: STATUS_MENU_ITEM.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[STATUS_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.statusDescription),
			keywords: ['lozenge'],
			title: formatMessage(messages.status),
		})),
		component: () => <StatusQuickInsertMenuItem api={api} previewImageUrls={previewImageUrls} />,
	},
];
