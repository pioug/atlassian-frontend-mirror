import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import AssetsIcon from '@atlaskit/icon/core/assets';
import PagesIcon from '@atlaskit/icon/core/pages';
import WorkItemsIcon from '@atlaskit/icon/core/work-items';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { CardPlugin } from '../../cardPluginType';
import { showDatasourceModal } from '../../pm-plugins/actions';

type Props = {
	api: ExtractInjectionAPI<CardPlugin> | undefined;
	type: 'assets' | 'confluence-search' | 'jira';
};

export const DatasourceQuickInsertMenuItem = ({ type }: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { isOffline } = useQuickInsertContext();
	const isJira = type === 'jira';
	const isConfluenceSearch = type === 'confluence-search';
	const onSelect = useCallback(
		({ insert }: OnSelectContext) => {
			const tr = insert(undefined);
			showDatasourceModal(type)(tr);
			return tr;
		},
		[type],
	);

	return (
		<QuickInsertMenuItem
			iconBefore={
				isJira ? (
					<WorkItemsIcon label="" />
				) : isConfluenceSearch ? (
					<PagesIcon label="" />
				) : (
					<AssetsIcon label="" />
				)
			}
			isDisabled={isOffline}
			onSelect={onSelect}
			title={formatMessage(
				isJira
					? fg('confluence-issue-terminology-refresh')
						? messages.datasourceJiraIssueIssueTermRefresh
						: messages.datasourceJiraIssue
					: isConfluenceSearch
						? messages.datasourceConfluenceSearch
						: messages.datasourceAssetsObjectsGeneralAvailability,
			)}
		/>
	);
};
