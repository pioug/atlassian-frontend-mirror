import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { toggleTable, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import {
	QuickInsertMenuItem,
	type OnSelectContext,
} from '@atlaskit/editor-common/quick-insert/menu-item';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import GridIcon from '@atlaskit/icon/core/grid';

import type { TablePlugin, TablePluginOptions } from '../../tablePluginType';

import { insertTableFromQuickInsert } from './insertTableFromQuickInsert';

type Props = {
	api: ExtractInjectionAPI<TablePlugin> | undefined;
	isTableSelectorEnabled: boolean | undefined;
	options: TablePluginOptions;
};

export const TableQuickInsertMenuItem = ({
	api,
	isTableSelectorEnabled,
	options,
}: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
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
			iconBefore={<GridIcon label="" />}
			onSelect={onSelect}
			shortcut={tooltip(toggleTable)}
			title={formatMessage(messages.table)}
		/>
	);
};
