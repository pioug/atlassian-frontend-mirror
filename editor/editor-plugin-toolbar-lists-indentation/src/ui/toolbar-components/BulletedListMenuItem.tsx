import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	toggleBulletList as toggleBulletListKeymap,
	formatShortcut,
} from '@atlaskit/editor-common/keymaps';
import { listMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ListBulletedIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type BulletedListType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const useBulletedListInfo = ({ api, parents }: BulletedListType) => {
	const { formatMessage } = useIntl();
	const bulletMessage = formatMessage(listMessages.bulletedList);
	const { bulletListActive, bulletListDisabled, taskListActive } = useSharedPluginStateWithSelector(
		api,
		['list', 'taskDecision'],
		(states) => ({
			bulletListActive: states.listState?.bulletListActive,
			bulletListDisabled: states.listState?.bulletListDisabled,
			taskListActive: states.taskDecisionState?.isInsideTask,
		}),
	);

	const onClick = () => {
		api?.core.actions.execute(
			taskListActive
				? api?.taskDecision?.commands.toggleTaskList('bulletList')
				: api?.list.commands.toggleBulletList(getInputMethodFromParentKeys(parents)),
		);
	};
	const isDisabled = bulletListDisabled && !taskListActive;
	const shortcut = formatShortcut(toggleBulletListKeymap);

	return {
		bulletMessage,
		onClick,
		isDisabled,
		isSelected: bulletListActive,
		shortcut,
	};
};
export const BulletedListMenuItem = ({ api, parents }: BulletedListType) => {
	const { bulletMessage, onClick, isDisabled, isSelected, shortcut } = useBulletedListInfo({
		api,
		parents,
	});

	return (
		<ToolbarDropdownItem
			elemBefore={<ListBulletedIcon size="small" label="" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			isSelected={isSelected}
			isDisabled={isDisabled}
			onClick={onClick}
			ariaKeyshortcuts={shortcut}
		>
			{bulletMessage}
		</ToolbarDropdownItem>
	);
};
