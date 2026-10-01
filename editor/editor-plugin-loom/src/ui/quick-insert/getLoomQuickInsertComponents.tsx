import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { CREATE_SECTION, LOOM_MENU_ITEM } from '@atlaskit/editor-common/quick-insert/keys';
import { CREATE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { LoomPlugin } from '../../loomPluginType';
import { LoomQuickInsertMenuItem } from './LoomQuickInsertMenuItem';

export const getLoomQuickInsertComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
}): RegisterMenuItem[] => [
	{
		key: LOOM_MENU_ITEM.key,
		type: LOOM_MENU_ITEM.type,
		parents: [
			{
				key: CREATE_SECTION.key,
				type: CREATE_SECTION.type,
				rank: CREATE_SECTION_RANK[LOOM_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.recordVideoDescription),
			keywords: ['loom', 'record', 'video'],
			title: formatMessage(messages.recordVideo),
		})),
		component: () => <LoomQuickInsertMenuItem api={api} />,
	},
];
