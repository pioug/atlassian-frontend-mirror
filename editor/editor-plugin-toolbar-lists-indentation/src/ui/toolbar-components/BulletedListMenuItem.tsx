import React from 'react';

import { useIntl } from 'react-intl';

import {
	toggleBulletList as toggleBulletListKeymap,
	formatShortcut,
} from '@atlaskit/editor-common/keymaps';
import { messages as listMessages } from '@atlaskit/editor-common/messages/list';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model/types';
import { ListBulletedIcon } from '@atlaskit/editor-toolbar/list-bulleted-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';
import { ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar/toolbar-keyboard-shortcut-hint';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type BulletedListType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const useBulletedListInfo = ({
	api,
	parents,
}: BulletedListType): {
	bulletMessage: string;
	isDisabled: boolean | undefined;
	isSelected: boolean | undefined;
	onClick: () => void;
	shortcut: string | undefined;
} => {
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

	const isDisabled = bulletListDisabled && !taskListActive;

	const onClick = (): void => {
		api?.core.actions.execute(
			taskListActive
				? api?.taskDecision?.commands.toggleTaskList('bulletList')
				: api?.list.commands.toggleBulletList(getInputMethodFromParentKeys(parents)),
		);
	};
	const shortcut = formatShortcut(toggleBulletListKeymap);

	return {
		bulletMessage,
		onClick,
		isDisabled,
		isSelected: bulletListActive,
		shortcut,
	};
};
export const BulletedListMenuItem = ({ api, parents }: BulletedListType): React.JSX.Element => {
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
