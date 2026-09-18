import React, { useCallback } from 'react';

import type { Appearance } from '@atlaskit/button/old-button/types';

import { ActionName, InternalActionName, type SmartLinkSize } from '../../../../../../constants';
import Action from '../../../actions/action';
import { type ActionProps } from '../../../actions/action/types';
import AISummaryAction from '../../../actions/ai-summary-action';
import AutomationAction from '../../../actions/automation-action';
import CopyLinkAction from '../../../actions/copy-link-action';
import CustomUnresolvedAction from '../../../actions/custom-unresolved-action';
import DeleteAction from '../../../actions/delete-action';
import DownloadAction from '../../../actions/download-action';
import EditAction from '../../../actions/edit-action';
import FollowAction from '../../../actions/follow-action';
import PreviewAction from '../../../actions/preview-action';
import RovoChatAction from '../../../actions/rovo-chat-action';
import ViewRelatedLinksAction from '../../../actions/view-related-links-action';
import { type ActionItem } from '../../types';

const Actions = {
	[ActionName.AutomationAction]: AutomationAction,
	[ActionName.CopyLinkAction]: CopyLinkAction,
	[ActionName.CustomAction]: Action,
	[ActionName.DeleteAction]: DeleteAction,
	[ActionName.DownloadAction]: DownloadAction,
	[ActionName.EditAction]: EditAction,
	[ActionName.FollowAction]: FollowAction,
	[ActionName.PreviewAction]: PreviewAction,
	[ActionName.RovoChatAction]: RovoChatAction,
	[InternalActionName.AISummaryAction]: AISummaryAction,
	[InternalActionName.UnresolvedAction]: CustomUnresolvedAction,
	[InternalActionName.ViewRelatedLinksAction]: ViewRelatedLinksAction,
};

const ActionGroupItem = ({
	item,
	size,
	appearance,
	asDropDownItems,
	onActionItemClick,
}: {
	appearance?: Appearance;
	asDropDownItems?: boolean;
	item: ActionItem;
	onActionItemClick?: () => void;
	size: SmartLinkSize;
}): React.JSX.Element | null => {
	const { name, hideContent, hideIcon, onClick, isDisabled, ...props } = item;
	const handleOnClick = useCallback(() => {
		if (onActionItemClick) {
			onActionItemClick();
		}
		if (onClick) {
			onClick();
		}
	}, [onActionItemClick, onClick]);

	const Action = name in Actions ? Actions[name as keyof typeof Actions] : undefined;

	if (!Action) {
		return null;
	}

	const actionProps: Partial<ActionProps> = {
		...props,
	};
	if (hideContent && !asDropDownItems) {
		actionProps.content = '';
	}
	if (hideIcon) {
		actionProps.icon = undefined;
	}

	if (item?.entryPointWrapper) {
		actionProps.wrapper = item.entryPointWrapper;
	}

	return (
		<Action
			asDropDownItem={asDropDownItems}
			size={size}
			appearance={appearance}
			onClick={handleOnClick}
			isDisabled={isDisabled}
			{...actionProps}
		/>
	);
};
export default ActionGroupItem;
