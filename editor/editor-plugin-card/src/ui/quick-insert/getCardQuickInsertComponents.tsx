import React from 'react';

import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import { createQuickInsertMatcher } from '@atlaskit/editor-common/quick-insert/create-quick-insert-matcher';
import {
	ASSETS_MENU_ITEM,
	CONFLUENCE_LIST_MENU_ITEM,
	DATA_AND_CHARTS_SECTION,
	JIRA_WORK_ITEMS_MENU_ITEM,
} from '@atlaskit/editor-common/quick-insert/keys';
import { DATA_AND_CHARTS_SECTION_RANK } from '@atlaskit/editor-common/quick-insert/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource/assets-modal';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '@atlaskit/link-datasource/confluence-search-modal';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { CardPlugin } from '../../cardPluginType';
import { isDatasourceConfigEditable } from '../../pm-plugins/utils';
import type { CardPluginOptions } from '../../types';
import { DatasourceQuickInsertMenuItem } from './DatasourceQuickInsertMenuItem';

type Params = {
	api: ExtractInjectionAPI<CardPlugin> | undefined;
	options: CardPluginOptions;
};

const datasourcePreviewImageUrlsByKey: Readonly<Record<string, { dark: string; light: string }>> = {
	[JIRA_WORK_ITEMS_MENU_ITEM.key]: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/m284qw5066530tr5yd11473uq1l8t86t.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/4b1455q46emetd0jxv70xuo7i7lwo574.png',
	},
	[CONFLUENCE_LIST_MENU_ITEM.key]: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/8jh31f0k143b475y5tun230v166c7087.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/6co68akkw56t83fql3m823qi21k8776u.png',
	},
	[ASSETS_MENU_ITEM.key]: {
		dark: 'https://dam-cdn.atl.orangelogic.com/AssetLink/64d41r462m2343iomn821ver0g4ohh37.png',
		light: 'https://dam-cdn.atl.orangelogic.com/AssetLink/0w58rc60jh54m68224qqinuk52d6lldt.png',
	},
};

export const getCardQuickInsertComponents = ({ api, options }: Params): RegisterMenuItem[] => {
	if (!options.allowDatasource) {
		return [];
	}

	const components: RegisterMenuItem[] = [
		{
			key: JIRA_WORK_ITEMS_MENU_ITEM.key,
			type: JIRA_WORK_ITEMS_MENU_ITEM.type,
			parents: [
				{
					key: DATA_AND_CHARTS_SECTION.key,
					type: DATA_AND_CHARTS_SECTION.type,
					rank: DATA_AND_CHARTS_SECTION_RANK[JIRA_WORK_ITEMS_MENU_ITEM.key],
				},
			],
			match: createQuickInsertMatcher(({ formatMessage }) => ({
				description: formatMessage(
					fg('confluence-issue-terminology-refresh')
						? messages.datasourceJiraIssueDescriptionIssueTermRefresh
						: messages.datasourceJiraIssueDescription,
				),
				keywords: ['jira'],
				title: formatMessage(
					fg('confluence-issue-terminology-refresh')
						? messages.datasourceJiraIssueIssueTermRefresh
						: messages.datasourceJiraIssue,
				),
			})),
			component: () => (
				<DatasourceQuickInsertMenuItem
					api={api}
					previewImageUrls={datasourcePreviewImageUrlsByKey[JIRA_WORK_ITEMS_MENU_ITEM.key]}
					type="jira"
				/>
			),
		},
	];

	if (canRenderDatasource(ASSETS_LIST_OF_LINKS_DATASOURCE_ID)) {
		components.push({
			key: ASSETS_MENU_ITEM.key,
			type: ASSETS_MENU_ITEM.type,
			parents: [
				{
					key: DATA_AND_CHARTS_SECTION.key,
					type: DATA_AND_CHARTS_SECTION.type,
					rank: DATA_AND_CHARTS_SECTION_RANK[ASSETS_MENU_ITEM.key],
				},
			],
			match: createQuickInsertMatcher(({ formatMessage }) => ({
				description: formatMessage(messages.datasourceAssetsObjectsDescription),
				keywords: ['assets'],
				title: formatMessage(messages.datasourceAssetsObjectsGeneralAvailability),
			})),
			component: () => (
				<DatasourceQuickInsertMenuItem
					api={api}
					previewImageUrls={datasourcePreviewImageUrlsByKey[ASSETS_MENU_ITEM.key]}
					type="assets"
				/>
			),
		});
	}

	if (isDatasourceConfigEditable(CONFLUENCE_SEARCH_DATASOURCE_ID)) {
		components.push({
			key: CONFLUENCE_LIST_MENU_ITEM.key,
			type: CONFLUENCE_LIST_MENU_ITEM.type,
			parents: [
				{
					key: DATA_AND_CHARTS_SECTION.key,
					type: DATA_AND_CHARTS_SECTION.type,
					rank: DATA_AND_CHARTS_SECTION_RANK[CONFLUENCE_LIST_MENU_ITEM.key],
				},
			],
			match: createQuickInsertMatcher(({ formatMessage }) => ({
				description: formatMessage(messages.datasourceConfluenceSearchDescription),
				keywords: ['confluence'],
				title: formatMessage(messages.datasourceConfluenceSearch),
			})),
			component: () => (
				<DatasourceQuickInsertMenuItem
					api={api}
					previewImageUrls={datasourcePreviewImageUrlsByKey[CONFLUENCE_LIST_MENU_ITEM.key]}
					type="confluence-search"
				/>
			),
		});
	}

	return components;
};
