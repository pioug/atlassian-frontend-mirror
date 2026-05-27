import React from 'react';

import { useIntl } from 'react-intl';

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
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { isMarkdownCompatibleToolbarEnabled } from '../utils/markdown-compatible-toolbar';

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
	const isMarkdownToolbarEnabled = isMarkdownCompatibleToolbarEnabled();
	const {
		pmBulletListActive,
		pmBulletListDisabled,
		pmOrderedListActive,
		pmTaskListActive,
		sourceBlockFormatState,
		sourceListFormatState,
		markdownView,
	} = useSharedPluginStateWithSelector(
		api,
		['list', 'taskDecision', 'interaction', 'markdownMode'],
		(states) => {
			const useDefaultToolbarState =
				states.interactionState?.interactionState === 'hasNotHadInteraction' &&
				expValEquals('platform_editor_default_toolbar_state', 'isEnabled', true);

			return {
				pmBulletListActive: useDefaultToolbarState
					? false
					: states.listState?.bulletListActive,
				pmBulletListDisabled: states.listState?.bulletListDisabled,
				pmOrderedListActive: useDefaultToolbarState
					? false
					: states.listState?.orderedListActive,
				pmTaskListActive: useDefaultToolbarState
					? false
					: states.taskDecisionState?.isInsideTask,
				markdownView: isMarkdownToolbarEnabled ? states.markdownModeState?.view : undefined,
				sourceBlockFormatState: isMarkdownToolbarEnabled
					? states.markdownModeState?.sourceBlockFormatState
					: null,
				sourceListFormatState: isMarkdownToolbarEnabled
					? states.markdownModeState?.sourceListFormatState
					: null,
			};
		});

	const isInSourceView = isMarkdownToolbarEnabled && markdownView === 'syntax';
	const isBulletListActive = isInSourceView
		? sourceListFormatState?.inBulletList
		: pmBulletListActive;
	const isOrderedListActive = isInSourceView
		? sourceListFormatState?.inOrderedList
		: pmOrderedListActive;
	const taskListActive = isInSourceView
		? Boolean(sourceListFormatState?.inTaskList)
		: pmTaskListActive;

	const getListType: ListType = taskListActive
		? 'taskList'
		: isOrderedListActive
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
		if (isInSourceView) {
			if (sourceBlockFormatState?.inCodeBlock || getListType === 'taskList') {
				return;
			}

			if (getListType === 'orderedList') {
				api?.markdownMode?.actions.toggleSourceOrderedList();
			} else {
				api?.markdownMode?.actions.toggleSourceBulletList();
			}
			return;
		}

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
			? isBulletListActive
			: getListType === 'orderedList'
				? isOrderedListActive
				: taskListActive;

	const isDisabled = isInSourceView
		? Boolean(sourceBlockFormatState?.inCodeBlock || taskListActive)
		: !isOrderedListActive && !taskListActive && pmBulletListDisabled;

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
	const { shortcut, message, onClick, iconBefore, isSelected, isDisabled } =
		useListsIndentationHeroButtonInfo({ api, parents, defaultListType: 'bulletList' });

	return (
		<ToolbarTooltip content={message}>
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
