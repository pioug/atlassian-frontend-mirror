import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	toggleBulletList as toggleBulletListKeymap,
	toggleOrderedList as toggleOrderedListKeymap,
	formatShortcut,
} from '@atlaskit/editor-common/keymaps';
import { listMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ListBulletedIcon,
	ListNumberedIcon,
	ToolbarButton,
	ToolbarTooltip,
} from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

type ListsIndentationHeroButtonProps = {
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>;
	parents: ToolbarComponentTypes;
};

export const ListsIndentationHeroButton = ({ api, parents }: ListsIndentationHeroButtonProps) => {
	const { formatMessage } = useIntl();

	const { bulletListActive, bulletListDisabled, orderedListActive } =
		useSharedPluginStateWithSelector(api, ['list'], (states) => ({
			bulletListActive: states.listState?.bulletListActive,
			bulletListDisabled: states.listState?.bulletListDisabled,
			orderedListActive: states.listState?.orderedListActive,
		}));

	const shortcut = orderedListActive
		? formatShortcut(toggleOrderedListKeymap)
		: formatShortcut(toggleBulletListKeymap);

	const onClick = () => {
		const inputMethod = getInputMethodFromParentKeys(parents);
		if (orderedListActive) {
			api?.core.actions.execute(api?.list.commands.toggleOrderedList(inputMethod));
		} else {
			api?.core.actions.execute(api?.list.commands.toggleBulletList(inputMethod));
		}
	};

	return (
		<ToolbarTooltip
			content={
				orderedListActive
					? formatMessage(listMessages.orderedList)
					: formatMessage(listMessages.bulletedList)
			}
		>
			<ToolbarButton
				iconBefore={
					orderedListActive ? (
						<ListNumberedIcon label={formatMessage(listMessages.orderedList)} size="small" />
					) : (
						<ListBulletedIcon label={formatMessage(listMessages.bulletedList)} size="small" />
					)
				}
				isSelected={bulletListActive || orderedListActive}
				isDisabled={!orderedListActive && bulletListDisabled}
				ariaKeyshortcuts={shortcut}
				onClick={onClick}
			/>
		</ToolbarTooltip>
	);
};
