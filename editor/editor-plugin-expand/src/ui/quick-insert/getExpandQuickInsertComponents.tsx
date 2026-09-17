import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { EXPAND_MENU_ITEM, STRUCTURE_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { ExpandPlugin } from '../../types';

import { ExpandQuickInsertMenuItem } from './ExpandQuickInsertMenuItem';

const previewImageUrls = {
	light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/ltu45641cf615ybs8mr78hme7370ka38.png',
	dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/gg4nl63re230l87iq0w0wqwas31esm3q.png',
};

export const getExpandQuickInsertComponents = ({
	api,
	isLegacy,
}: {
	api: ExtractInjectionAPI<ExpandPlugin> | undefined;
	isLegacy: boolean;
}): RegisterMenuItem[] => [
	{
		key: EXPAND_MENU_ITEM.key,
		type: EXPAND_MENU_ITEM.type,
		parents: [{ ...STRUCTURE_SECTION, rank: STRUCTURE_SECTION_RANK[EXPAND_MENU_ITEM.key] }],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.expandDescription),
			keywords: ['accordion', 'collapse'],
			title: formatMessage(messages.expand),
		})),
		component: () => (
			<ExpandQuickInsertMenuItem
				api={api}
				isLegacy={isLegacy}
				previewImageUrls={previewImageUrls}
			/>
		),
	},
];
