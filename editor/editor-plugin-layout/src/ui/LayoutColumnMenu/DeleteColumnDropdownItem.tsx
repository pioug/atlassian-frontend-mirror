import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { deleteColumn, getAriaKeyshortcuts, tooltip } from '@atlaskit/editor-common/keymaps';
import { toolbarMessages as layoutMessages } from '@atlaskit/editor-common/messages/layout';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { DeleteIcon } from '@atlaskit/editor-toolbar/delete-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import type { LayoutPlugin } from '../../layoutPluginType';
import { useSelectedLayoutColumns } from './useSelectedLayoutColumns';

type DeleteColumnDropdownItemProps = {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
};

const DeleteColumnDropdownItem = ({
	api,
}: DeleteColumnDropdownItemProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const selectedLayoutColumns = useSelectedLayoutColumns(api);

	const setDangerPreview = useCallback(
		(show: boolean) => {
			api?.core?.actions.execute(api?.layout?.commands.setLayoutColumnDangerPreview(show));
		},
		[api],
	);

	const showDangerPreview = useCallback(() => {
		setDangerPreview(true);
	}, [setDangerPreview]);

	const hideDangerPreview = useCallback(() => {
		setDangerPreview(false);
	}, [setDangerPreview]);

	const onClick = useCallback(() => {
		const deleteCommand = api?.layout?.commands.deleteLayoutColumn({
			inputMethod: INPUT_METHOD.LAYOUT_COLUMN_MENU,
		});

		api?.core?.actions.execute((props) => {
			const tr = deleteCommand?.(props);
			if (!tr) {
				return tr ?? null;
			}

			api?.layout?.commands.toggleLayoutColumnMenu({ isOpen: false })({ tr });
			return tr;
		});
	}, [api]);

	if (selectedLayoutColumns === undefined) {
		return null;
	}

	const selectedColumnCount = selectedLayoutColumns.selectedLayoutColumns.length;

	return (
		<ToolbarDropdownItem
			ariaKeyshortcuts={getAriaKeyshortcuts(deleteColumn)}
			onClick={onClick}
			onFocus={showDangerPreview}
			onMouseEnter={showDangerPreview}
			onBlur={hideDangerPreview}
			onMouseLeave={hideDangerPreview}
			elemBefore={<DeleteIcon color="currentColor" label="" size="small" />}
			elemAfter={<ToolbarKeyboardShortcutHint shortcut={tooltip(deleteColumn) ?? ''} />}
		>
			{formatMessage(layoutMessages.deleteColumn, { count: selectedColumnCount })}
		</ToolbarDropdownItem>
	);
};

export { DeleteColumnDropdownItem };
