import React, { useCallback } from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl';

import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	TableColumnAddLeftIcon,
	TableColumnAddRightIcon,
	ToolbarDropdownItem,
} from '@atlaskit/editor-toolbar';

import type { LayoutPlugin } from '../../layoutPluginType';
import {
	getEffectiveMaxLayoutColumns,
	type InsertLayoutColumnSide,
} from '../../pm-plugins/actions';

import { useSelectedLayoutColumns } from './useSelectedLayoutColumns';

type InsertColumnOption = {
	Icon: typeof TableColumnAddLeftIcon;
	label: MessageDescriptor;
	side: InsertLayoutColumnSide;
};

const INSERT_COLUMN_OPTIONS: Record<InsertLayoutColumnSide, InsertColumnOption> = {
	left: {
		Icon: TableColumnAddLeftIcon,
		label: layoutMessages.addColumnLeft,
		side: 'left',
	},
	right: {
		Icon: TableColumnAddRightIcon,
		label: layoutMessages.addColumnRight,
		side: 'right',
	},
};

type InsertColumnDropdownItemProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
	side: InsertLayoutColumnSide;
};

export const InsertColumnDropdownItem = ({
	api,
	side,
}: InsertColumnDropdownItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const { Icon, label } = INSERT_COLUMN_OPTIONS[side];
	const selectedLayoutColumns = useSelectedLayoutColumns(api);
	const columnCount = selectedLayoutColumns?.layoutSectionNode?.childCount ?? 0;
	const maxColumnCount = getEffectiveMaxLayoutColumns();
	const canInsertColumn = selectedLayoutColumns !== undefined && columnCount < maxColumnCount;
	const onClick = useCallback(() => {
		const insertCommand = api?.layout?.commands.insertLayoutColumn(side);

		api?.core?.actions.execute((props) => {
			const tr = insertCommand?.(props);
			if (!tr) {
				return tr ?? null;
			}

			api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false })({ tr });
			return tr;
		});
	}, [api, side]);

	if (!canInsertColumn) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			elemBefore={<Icon color="currentColor" label="" size="small" />}
			onClick={onClick}
		>
			{formatMessage(label)}
		</ToolbarDropdownItem>
	);
};
