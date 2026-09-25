import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { toggleTable, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
	type QuickInsertMenuItemProps,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import { messages as quickInsertMessages } from '@atlaskit/editor-common/quick-insert/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import GridIcon from '@atlaskit/icon/core/grid';

import type { TablePlugin, TablePluginOptions } from '../../tablePluginType';
import { insertTableFromQuickInsert } from './insertTableFromQuickInsert';

type Props = {
	api: ExtractInjectionAPI<TablePlugin> | undefined;
	isTableSelectorEnabled: boolean | undefined;
	options: TablePluginOptions;
	previewImageUrls?: QuickInsertMenuItemProps['previewImageUrls'];
};

export const TableQuickInsertMenuItem = ({
	api,
	isTableSelectorEnabled,
	options,
	previewImageUrls,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const preview = useMemo(
		() =>
			previewImageUrls
				? {
						image: previewImageUrls,
						attribution: {
							name: formatMessage(quickInsertMessages.previewAttributionAtlassian),
						},
					}
				: undefined,
		[formatMessage, previewImageUrls],
	);
	const onSelect = useCallback(
		({ editorView, insert, source }: OnSelectContext) =>
			insertTableFromQuickInsert({
				api,
				inputMethod: source,
				insert,
				isTableSelectorEnabled,
				options,
				state: editorView.state,
			}),
		[api, isTableSelectorEnabled, options],
	);

	return (
		<QuickInsertMenuItem
			description={formatMessage(messages.tableDescription)}
			iconBefore={<GridIcon label="" />}
			onSelect={onSelect}
			preview={preview}
			shortcut={tooltip(toggleTable)}
			title={formatMessage(messages.table)}
		/>
	);
};
