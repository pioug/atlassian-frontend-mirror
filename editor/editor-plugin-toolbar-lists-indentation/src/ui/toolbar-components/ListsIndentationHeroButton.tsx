import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	toggleBulletList as toggleBulletListKeymap,
	toggleOrderedList as toggleOrderedListKeymap,
	toggleTaskList as toggleTaskListKeymap,
	formatShortcut,
	ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { listMessages, tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ListBulletedIcon,
	ListNumberedIcon,
	ToolbarButton,
	ToolbarTooltip,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import TaskIcon from '@atlaskit/icon/core/task';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type ListsIndentationHeroButtonProps = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

type ListType = 'bulletList' | 'orderedList' | 'taskList';

function useListsIndentationHeroButtonInfo({
	api,
	parents,
	defaultListType,
}: ListsIndentationHeroButtonProps & {
	defaultListType: 'bulletList' | 'orderedList';
}) {
	const { formatMessage } = useIntl();
	const { bulletListActive, bulletListDisabled, orderedListActive, taskListActive } =
		useSharedPluginStateWithSelector(api, ['list', 'taskDecision'], (states) => ({
			bulletListActive: states.listState?.bulletListActive,
			bulletListDisabled: states.listState?.bulletListDisabled,
			orderedListActive: states.listState?.orderedListActive,
			taskListActive: states.taskDecisionState?.isInsideTask,
		}));

	const getListType: ListType = taskListActive
		? 'taskList'
		: orderedListActive
			? 'orderedList'
			: defaultListType;
	const taskListKeymap = toggleTaskListKeymap;
	const getKeymap =
		getListType === 'taskList'
			? taskListKeymap
			: getListType === 'orderedList'
				? toggleOrderedListKeymap
				: toggleBulletListKeymap;

	const shortcut = formatShortcut(getKeymap);
	const keymap = getKeymap;
	const message =
		getListType === 'taskList'
			? formatMessage(tasksAndDecisionsMessages.taskList)
			: getListType === 'orderedList'
				? formatMessage(listMessages.orderedList)
				: formatMessage(listMessages.bulletedList);

	const onClick = () => {
		const inputMethod = getInputMethodFromParentKeys(parents);
		if (getListType === 'taskList') {
			api?.core.actions.execute(api?.taskDecision?.commands.toggleTaskList());
		} else if (getListType === 'orderedList') {
			api?.core.actions.execute(api?.list.commands.toggleOrderedList(inputMethod));
		} else {
			api?.core.actions.execute(api?.list.commands.toggleBulletList(inputMethod));
		}
	};

	const iconBefore =
		getListType === 'taskList' ? (
			<TaskIcon label={formatMessage(tasksAndDecisionsMessages.taskList)} size="small" />
		) : getListType === 'orderedList' ? (
			<ListNumberedIcon label={formatMessage(listMessages.orderedList)} size="small" />
		) : (
			<ListBulletedIcon label={formatMessage(listMessages.bulletedList)} size="small" />
		);
	const isSelected =
		getListType === 'bulletList'
			? bulletListActive
			: getListType === 'orderedList'
				? orderedListActive
				: taskListActive;

	const isDisabled = !orderedListActive && !taskListActive && bulletListDisabled;

	return {
		shortcut,
		keymap,
		message,
		onClick,
		iconBefore,
		isSelected,
		isDisabled,
	};
}

export const ListsIndentationHeroButtonCollapsed = ({
	api,
	parents,
}: ListsIndentationHeroButtonProps): React.JSX.Element => {
	const { shortcut, keymap, message, onClick, iconBefore, isSelected, isDisabled } =
		useListsIndentationHeroButtonInfo({ api, parents, defaultListType: 'bulletList' });

	return (
		<ToolbarTooltip content={<ToolTipContent description={message} keymap={keymap} />}>
			<ToolbarButton
				iconBefore={iconBefore}
				isSelected={isSelected}
				isDisabled={isDisabled}
				ariaKeyshortcuts={shortcut}
				onClick={onClick}
			/>
		</ToolbarTooltip>
	);
};

export const ListsIndentationHeroButtonNew = ({
	api,
	parents,
}: ListsIndentationHeroButtonProps): React.JSX.Element => {
	const { shortcut, keymap, message, onClick, iconBefore, isSelected, isDisabled } =
		useListsIndentationHeroButtonInfo({ api, parents, defaultListType: 'orderedList' });

	return (
		<ToolbarTooltip content={<ToolTipContent description={message} keymap={keymap} />}>
			<ToolbarButton
				iconBefore={iconBefore}
				isSelected={isSelected}
				isDisabled={isDisabled}
				ariaKeyshortcuts={shortcut}
				onClick={onClick}
			/>
		</ToolbarTooltip>
	);
};

export const ListsIndentationHeroButton = ({
	api,
	parents,
}: ListsIndentationHeroButtonProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const { bulletListActive, bulletListDisabled, orderedListActive, taskListActive } =
		useSharedPluginStateWithSelector(api, ['list', 'taskDecision'], (states) => ({
			bulletListActive: states.listState?.bulletListActive,
			bulletListDisabled: states.listState?.bulletListDisabled,
			orderedListActive: states.listState?.orderedListActive,
			taskListActive: states.taskDecisionState?.isInsideTask,
		}));

	const taskListKeymap = toggleTaskListKeymap;

	const shortcut = taskListActive
		? formatShortcut(taskListKeymap)
		: orderedListActive
			? formatShortcut(toggleOrderedListKeymap)
			: formatShortcut(toggleBulletListKeymap);

	const onClick = () => {
		const inputMethod = getInputMethodFromParentKeys(parents);
		if (taskListActive) {
			api?.core.actions.execute(api?.taskDecision?.commands.toggleTaskList());
		} else if (orderedListActive) {
			api?.core.actions.execute(api?.list.commands.toggleOrderedList(inputMethod));
		} else {
			api?.core.actions.execute(api?.list.commands.toggleBulletList(inputMethod));
		}
	};

	return (
		<ToolbarTooltip
			content={
				taskListActive
					? formatMessage(tasksAndDecisionsMessages.taskList)
					: orderedListActive
						? formatMessage(listMessages.orderedList)
						: formatMessage(listMessages.bulletedList)
			}
		>
			<ToolbarButton
				iconBefore={
					taskListActive ? (
						<TaskIcon label={formatMessage(tasksAndDecisionsMessages.taskList)} size="small" />
					) : orderedListActive ? (
						<ListNumberedIcon label={formatMessage(listMessages.orderedList)} size="small" />
					) : (
						<ListBulletedIcon label={formatMessage(listMessages.bulletedList)} size="small" />
					)
				}
				isSelected={bulletListActive || orderedListActive || taskListActive}
				isDisabled={!orderedListActive && !taskListActive && bulletListDisabled}
				ariaKeyshortcuts={shortcut}
				onClick={onClick}
			/>
		</ToolbarTooltip>
	);
};
