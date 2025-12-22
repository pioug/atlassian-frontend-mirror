import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { listMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ListNumberedIcon from '@atlaskit/icon/core/list-numbered';

import type { ListPlugin } from '../listPluginType';

type NumberedListBlockMenuItemProps = {
	api: ExtractInjectionAPI<ListPlugin> | undefined;
};

const NODE_NAME = 'orderedList';

const NumberedListBlockMenuItem = ({ api }: NumberedListBlockMenuItemProps) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.orderedList, {
				inputMethod,
				triggeredFrom,
				targetTypeName: NODE_NAME,
			});
			return command ? command({ tr }) : null;
		});
	};

	const isTransfromToPanelDisabled = api?.blockMenu?.actions.isTransformOptionDisabled(NODE_NAME);
	if (isTransfromToPanelDisabled) {
		return null;
	}

	return (
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<ListNumberedIcon label="" />}>
			{formatMessage(listMessages.orderedList)}
		</ToolbarDropdownItem>
	);
};

export const createNumberedListBlockMenuItem = ({ api }: NumberedListBlockMenuItemProps) => {
	return (): React.JSX.Element => <NumberedListBlockMenuItem api={api} />;
};
