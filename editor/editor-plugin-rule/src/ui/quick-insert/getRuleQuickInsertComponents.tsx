import React from 'react';

import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import { RULE_MENU_ITEM, STRUCTURE_SECTION } from '@atlaskit/editor-common/quick-insert/keys';
import { STRUCTURE_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import type { RulePlugin } from '../../rulePluginType';
import { RuleQuickInsertMenuItem } from './RuleQuickInsertMenuItem';

const previewImageUrls = {
	light: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVL8.png',
	dark: 'https://dam-cdn.atl.orangelogic.com/CDNLink/AT12OVK1.png',
};

export const getRuleQuickInsertComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<RulePlugin> | undefined;
}): RegisterMenuItem[] => [
	{
		key: RULE_MENU_ITEM.key,
		type: RULE_MENU_ITEM.type,
		parents: [
			{
				key: STRUCTURE_SECTION.key,
				type: STRUCTURE_SECTION.type,
				rank: STRUCTURE_SECTION_RANK[RULE_MENU_ITEM.key],
			},
		],
		match: createQuickInsertMatcher(({ formatMessage }) => ({
			description: formatMessage(messages.horizontalRuleDescription),
			keywords: ['horizontal', 'rule', 'line', 'hr'],
			shortcut: '---',
			title: formatMessage(messages.horizontalRule),
		})),
		component: () => <RuleQuickInsertMenuItem api={api} previewImageUrls={previewImageUrls} />,
	},
];
