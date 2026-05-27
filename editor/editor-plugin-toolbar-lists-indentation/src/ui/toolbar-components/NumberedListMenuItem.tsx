import React from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	toggleOrderedList as toggleOrderedListKeymap,
	formatShortcut,
} from '@atlaskit/editor-common/keymaps';
import { listMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ListNumberedIcon,
	ToolbarDropdownItem,
	ToolbarKeyboardShortcutHint,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';
import { isMarkdownCompatibleToolbarEnabled } from '../utils/markdown-compatible-toolbar';

type NumberedListMenuItemType = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const NumberedListMenuItem = ({
	api,
	parents,
}: NumberedListMenuItemType): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isMarkdownToolbarEnabled = isMarkdownCompatibleToolbarEnabled();
	const {
		orderedListActive,
		orderedListDisabled,
		taskListActive,
		sourceBlockFormatState,
		sourceListFormatState,
		markdownView,
	} = useSharedPluginStateWithSelector(api, ['list', 'taskDecision', 'markdownMode'], (states) => ({
		orderedListActive: states.listState?.orderedListActive,
		orderedListDisabled: states.listState?.orderedListDisabled,
		taskListActive: states.taskDecisionState?.isInsideTask,
		markdownView: isMarkdownToolbarEnabled ? states.markdownModeState?.view : undefined,
		sourceBlockFormatState: isMarkdownToolbarEnabled
			? states.markdownModeState?.sourceBlockFormatState
			: null,
		sourceListFormatState: isMarkdownToolbarEnabled
			? states.markdownModeState?.sourceListFormatState
			: null,
	}));

	const isInSourceView = isMarkdownToolbarEnabled && markdownView === 'syntax';
	const isSourceTaskListActive = Boolean(sourceListFormatState?.inTaskList);

	const onClick = () => {
		if (isInSourceView) {
			if (sourceBlockFormatState?.inCodeBlock) {
				return;
			}
			if (isSourceTaskListActive) {
				return;
			}
			api?.markdownMode?.actions.toggleSourceOrderedList();
			return;
		}
		api?.core.actions.execute(
			taskListActive
				? api?.taskDecision?.commands.toggleTaskList('orderedList')
				: api?.list.commands.toggleOrderedList(getInputMethodFromParentKeys(parents)),
		);
	};

	const shortcut = formatShortcut(toggleOrderedListKeymap);

	return (
		<ToolbarDropdownItem
			elemBefore={<ListNumberedIcon size="small" label="" />}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			isSelected={isInSourceView ? sourceListFormatState?.inOrderedList : orderedListActive}
			isDisabled={
				isInSourceView
					? Boolean(sourceBlockFormatState?.inCodeBlock || isSourceTaskListActive)
					: orderedListDisabled && !taskListActive
			}
			onClick={onClick}
			ariaKeyshortcuts={shortcut}
		>
			{formatMessage(listMessages.orderedList)}
		</ToolbarDropdownItem>
	);
};
