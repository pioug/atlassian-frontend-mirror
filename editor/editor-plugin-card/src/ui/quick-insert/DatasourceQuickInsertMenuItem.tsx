import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { cardMessages as messages } from '@atlaskit/editor-common/messages';
import { ConfluenceAttributionIcon } from '@atlaskit/editor-common/quick-insert/confluence-attribution-icon';
import { JiraAttributionIcon } from '@atlaskit/editor-common/quick-insert/jira-attribution-icon';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
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
	previewImageUrls: QuickInsertMenuItemProps['previewImageUrls'];
	type: 'assets' | 'confluence-search' | 'jira';
};

export const DatasourceQuickInsertMenuItem = ({
	previewImageUrls,
	type,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { isOffline } = useQuickInsertContext();
	const isJira = type === 'jira';
	const isConfluenceSearch = type === 'confluence-search';
	const description = formatMessage(
		isJira
			? fg('confluence-issue-terminology-refresh')
				? messages.datasourceJiraIssueDescriptionIssueTermRefresh
				: messages.datasourceJiraIssueDescription
			: isConfluenceSearch
				? messages.datasourceConfluenceSearchDescription
				: messages.datasourceAssetsObjectsDescription,
	);
	const preview = useMemo(
		() =>
			previewImageUrls
				? {
						image: previewImageUrls,
						attribution: {
							name: formatMessage(
								isJira
									? quickInsertMessages.previewAttributionJira
									: isConfluenceSearch
										? quickInsertMessages.previewAttributionConfluence
										: quickInsertMessages.previewAttributionAssets,
							),
							...((isJira || isConfluenceSearch) && {
								icon: isJira ? JiraAttributionIcon : ConfluenceAttributionIcon,
							}),
						},
					}
				: undefined,
		[formatMessage, isConfluenceSearch, isJira, previewImageUrls],
	);
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
			description={description}
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
			preview={preview}
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
