import React, { useCallback } from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	addColumnAfter,
	addColumnBefore,
	getAriaKeyshortcuts,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	TableColumnAddLeftIcon,
	TableColumnAddRightIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
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
	const shortcut = side === 'left' ? addColumnBefore : addColumnAfter;
	const selectedLayoutColumns = useSelectedLayoutColumns(api);
	const columnCount = selectedLayoutColumns?.layoutSectionNode?.childCount ?? 0;
	const maxColumnCount = getEffectiveMaxLayoutColumns();
	const canInsertColumn = selectedLayoutColumns !== undefined && columnCount < maxColumnCount;
	const onClick = useCallback(() => {
		const insertCommand = api?.layout?.commands.insertLayoutColumn({
			side,
			inputMethod: INPUT_METHOD.LAYOUT_COLUMN_MENU,
		});

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
			ariaKeyshortcuts={getAriaKeyshortcuts(shortcut)}
			elemBefore={<Icon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(shortcut) ?? ''} />}
			onClick={onClick}
		>
			{formatMessage(label)}
		</ToolbarDropdownItem>
	);
};
