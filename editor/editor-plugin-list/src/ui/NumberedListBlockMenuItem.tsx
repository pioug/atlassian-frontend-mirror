import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { listMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ListNumberedIcon from '@atlaskit/icon/core/list-numbered';

import type { ListPlugin } from '../listPluginType';

type NumberedListBlockMenuItemProps = {
	api: ExtractInjectionAPI<ListPlugin> | undefined;
};

const NumberedListBlockMenuItem = ({ api }: NumberedListBlockMenuItemProps) => {
	const { formatMessage } = useIntl();
	const orderedListActive = useSharedPluginStateSelector(api, 'list.orderedListActive');
	const currentSelectedNodeName = useSharedPluginStateSelector(
		api,
		'blockMenu.currentSelectedNodeName',
	);

	// Check if a blockquote is currently selected
	const isBlockquoteSelected = currentSelectedNodeName?.includes('blockquote');

	// Only show as selected if ordered list is active AND we're not selecting a blockquote
	const isSelected = orderedListActive && !isBlockquoteSelected;

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		if (!orderedListActive) {
			const inputMethod =
				event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
					? INPUT_METHOD.KEYBOARD
					: INPUT_METHOD.MOUSE;
			const triggeredFrom = INPUT_METHOD.BLOCK_MENU;

			api?.core.actions.execute(
				api?.blockMenu?.commands.formatNode(`orderedList`, { inputMethod, triggeredFrom }),
			);
		}
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={isSelected}
			elemBefore={<ListNumberedIcon label="" />}
		>
			{formatMessage(listMessages.orderedList)}
		</ToolbarDropdownItem>
	);
};

export const createNumberedListBlockMenuItem = ({ api }: NumberedListBlockMenuItemProps) => {
	return () => <NumberedListBlockMenuItem api={api} />;
};
