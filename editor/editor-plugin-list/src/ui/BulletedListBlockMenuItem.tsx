// BulletedListBlockMenuItem.tsx

import React from 'react';

import { useIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { listMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';

import type { ListPlugin } from '../listPluginType';

type BulletedListBlockMenuItemProps = {
	api: ExtractInjectionAPI<ListPlugin> | undefined;
};

const BulletedListBlockMenuItem = ({ api }: BulletedListBlockMenuItemProps) => {
	const { formatMessage } = useIntl();
	const bulletListActive = useSharedPluginStateSelector(api, 'list.bulletListActive');
	const currentSelectedNodeName = useSharedPluginStateSelector(
		api,
		'blockMenu.currentSelectedNodeName',
	);

	// Check if a blockquote is currently selected
	const isBlockquoteSelected = currentSelectedNodeName?.includes('blockquote');

	// Only show as selected if bullet list is active AND we're not selecting a blockquote
	const isSelected = bulletListActive && !isBlockquoteSelected;

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		if (!bulletListActive) {
			const triggeredFrom =
				event.nativeEvent instanceof KeyboardEvent || event.nativeEvent.detail === 0
					? INPUT_METHOD.KEYBOARD
					: INPUT_METHOD.MOUSE;
			const inputMethod = INPUT_METHOD.BLOCK_MENU;

			api?.core.actions.execute(({ tr }) => {
				const command = api?.blockMenu?.commands.transformNode(
					tr.doc.type.schema.nodes.bulletList,
					{
						inputMethod,
						triggeredFrom,
						targetTypeName: 'bulletList',
					},
				);
				return command ? command({ tr }) : null;
			});
		}
	};

	return (
		<ToolbarDropdownItem
			onClick={handleClick}
			isSelected={isSelected}
			elemBefore={<ListBulletedIcon label="" />}
		>
			{formatMessage(listMessages.bulletedList)}
		</ToolbarDropdownItem>
	);
};

export const createBulletedListBlockMenuItem = ({ api }: BulletedListBlockMenuItemProps) => {
	return (): React.JSX.Element => <BulletedListBlockMenuItem api={api} />;
};
