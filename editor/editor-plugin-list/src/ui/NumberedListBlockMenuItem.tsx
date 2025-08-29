import React from 'react';

import { useIntl } from 'react-intl-next';

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

	const handleClick = () => {
		if (!orderedListActive) {
			api?.core.actions.execute(api?.blockMenu?.commands.formatNode(`orderedList`));
		}
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={orderedListActive}
			elemBefore={<ListNumberedIcon label="" />}
		>
			{formatMessage(listMessages.orderedList)}
		</ToolbarDropdownItem>
	);
};

export const createNumberedListBlockMenuItem = ({ api }: NumberedListBlockMenuItemProps) => {
	return () => <NumberedListBlockMenuItem api={api} />;
};
