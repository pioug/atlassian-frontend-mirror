import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { MEDIA_INSERT_MENU_ITEM, MEDIA_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { MEDIA_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { MediaInsertPlugin, MediaInsertPluginConfig } from '../../mediaInsertPluginType';

import { MediaInsertQuickInsertMenuItem } from './MediaInsertQuickInsertMenuItem';

type Params = {
	api: ExtractInjectionAPI<MediaInsertPlugin> | undefined;
	config: MediaInsertPluginConfig | undefined;
};

export const getMediaInsertQuickInsertComponents = ({
	api,
	config,
}: Params): RegisterMenuItem[] => [
	{
		key: MEDIA_INSERT_MENU_ITEM.key,
		type: MEDIA_INSERT_MENU_ITEM.type,
		parents: [
			{
				key: MEDIA_SECTION.key,
				type: MEDIA_SECTION.type,
				rank: MEDIA_SECTION_RANK[MEDIA_INSERT_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.mediaFilesDescription),
			keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video', 'file'],
			title: formatMessage(messages.mediaFiles),
		})),
		component: () => <MediaInsertQuickInsertMenuItem api={api} config={config} />,
	},
];
