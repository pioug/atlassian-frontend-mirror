import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { deleteColumn, getAriaKeyshortcuts, tooltip } from '@atlaskit/editor-common/keymaps';
import { layoutMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	DeleteIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';

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
		const deleteCommand = api?.layout?.commands.deleteLayoutColumn();

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
