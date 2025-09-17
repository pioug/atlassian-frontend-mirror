// BulletedListBlockMenuItem.tsx

import React from 'react';

import { useIntl } from 'react-intl-next';

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

	const handleClick = () => {
		if (!bulletListActive) {
			api?.core.actions.execute(api?.blockMenu?.commands.formatNode(`bulletList`));
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
	return () => <BulletedListBlockMenuItem api={api} />;
};
