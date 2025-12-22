import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { listMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

import type { ListPlugin } from '../listPluginType';

type BulletedListBlockMenuItemProps = {
	api: ExtractInjectionAPI<ListPlugin> | undefined;
};

const NODE_NAME = 'bulletList';

const BulletedListBlockMenuItem = ({ api }: BulletedListBlockMenuItemProps) => {
	const { formatMessage } = useIntl();

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		const triggeredFrom =
			event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
				? INPUT_METHOD.KEYBOARD
				: INPUT_METHOD.MOUSE;
		const inputMethod = INPUT_METHOD.BLOCK_MENU;

		api?.core.actions.execute(({ tr }) => {
			const command = api?.blockMenu?.commands.transformNode(tr.doc.type.schema.nodes.bulletList, {
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
		<ToolbarDropdownItem onClick={handleClick} elemBefore={<ListBulletedIcon label="" />}>
			{formatMessage(listMessages.bulletedList)}
		</ToolbarDropdownItem>
	);
};

export const createBulletedListBlockMenuItem = ({ api }: BulletedListBlockMenuItemProps) => {
	return (): React.JSX.Element => <BulletedListBlockMenuItem api={api} />;
};
