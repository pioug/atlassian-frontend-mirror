import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	toggleBulletList as toggleBulletListKeymap,
	toggleOrderedList as toggleOrderedListKeymap,
	toggleTaskItemCheckbox as toggleTaskItemCheckboxKeymap,
	formatShortcut,
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
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type ListsIndentationHeroButtonProps = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const ListsIndentationHeroButton = ({ api, parents }: ListsIndentationHeroButtonProps) => {
	const { formatMessage } = useIntl();
	const isPatch2Enabled = expValEquals('platform_editor_toolbar_aifc_patch_2', 'isEnabled', true);

	const { bulletListActive, bulletListDisabled, orderedListActive, taskListActive } =
		useSharedPluginStateWithSelector(api, ['list', 'taskDecision'], (states) => ({
			bulletListActive: states.listState?.bulletListActive,
			bulletListDisabled: states.listState?.bulletListDisabled,
			orderedListActive: states.listState?.orderedListActive,
			taskListActive: states.taskDecisionState?.isInsideTask,
		}));

	const shortcut =
		isPatch2Enabled && taskListActive
			? formatShortcut(toggleTaskItemCheckboxKeymap)
			: orderedListActive
				? formatShortcut(toggleOrderedListKeymap)
				: formatShortcut(toggleBulletListKeymap);

	const onClick = () => {
		const inputMethod = getInputMethodFromParentKeys(parents);
		if (isPatch2Enabled && taskListActive) {
			// Placeholder onClick for task list - no logic as per requirements
			// This will be implemented in a separate ticket
		} else if (orderedListActive) {
			api?.core.actions.execute(api?.list.commands.toggleOrderedList(inputMethod));
		} else {
			api?.core.actions.execute(api?.list.commands.toggleBulletList(inputMethod));
		}
	};

	return (
		<ToolbarTooltip
			content={
				isPatch2Enabled && taskListActive
					? formatMessage(tasksAndDecisionsMessages.taskList)
					: orderedListActive
						? formatMessage(listMessages.orderedList)
						: formatMessage(listMessages.bulletedList)
			}
		>
			<ToolbarButton
				iconBefore={
					isPatch2Enabled && taskListActive ? (
						<TaskIcon label={formatMessage(tasksAndDecisionsMessages.taskList)} size="small" />
					) : orderedListActive ? (
						<ListNumberedIcon label={formatMessage(listMessages.orderedList)} size="small" />
					) : (
						<ListBulletedIcon label={formatMessage(listMessages.bulletedList)} size="small" />
					)
				}
				isSelected={bulletListActive || orderedListActive || (isPatch2Enabled && taskListActive)}
				isDisabled={
					!orderedListActive && !(isPatch2Enabled && taskListActive) && bulletListDisabled
				}
				ariaKeyshortcuts={shortcut}
				onClick={onClick}
			/>
		</ToolbarTooltip>
	);
};
