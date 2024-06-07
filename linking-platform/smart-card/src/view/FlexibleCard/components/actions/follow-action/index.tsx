import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import ServerAction from '../action/server-action';
import { type FollowActionProps } from './types';
import UnfollowIcon from './unfollow-icon';
import { importIcon } from '../../utils';
import { getFollowActionErrorMessage } from './utils';

const importIconMapper: {
	[key: string]: (() => Promise<any>) | undefined;
} = {
	goal: () =>
		import(/* webpackChunkName: "glyphGoal" */ './goal-icon').then(({ GoalIcon }) => ({
			default: GoalIcon,
		})),
	projects: () =>
		import(/* webpackChunkName: "glyphProjects" */ './projects-icon').then(({ ProjectsIcon }) => ({
			default: ProjectsIcon,
		})),
};

const getIcon = (stackIconType: string) => {
	const importFn = importIconMapper[stackIconType];
	if (!importFn) {
		return null;
	}
	return importIcon(importFn);
};

const getIconFF = (iconFFEnabled: JSX.Element, defaultIcon: JSX.Element) => {
	if (getBooleanFF('platform.linking-platform.smart-card.hover-card-action-redesign')) {
		if (getBooleanFF('platform.linking-platform.smart-card.action-icon-redesign')) {
			return iconFFEnabled;
		}
	}
	return defaultIcon;
};

const FollowAction = (props: FollowActionProps) => {
	const context = useFlexibleUiContext();

	const actionData = context?.actions?.[ActionName.FollowAction];

	if (!context || !actionData) {
		return null;
	}

	const { value, isProject, ...data } = actionData;

	const isStackItem = props.as === 'stack-item';

	const message = value ? messages.follow : messages.unfollow;

	const projectMessage = value ? messages.follow_project : messages.unfollow_project;
	const goalMessage = value ? messages.follow_goal : messages.unfollow_goal;

	const stackMessage = isProject ? projectMessage : goalMessage;
	const label = isStackItem ? stackMessage : message;

	const projectTooltipMessage = value
		? messages.follow_project_description
		: messages.unfollow_project_description;
	const goalTooltipMessage = value
		? messages.follow_goal_description
		: messages.unfollow_goal_description;

	const stackTooltipMessage = isProject ? projectTooltipMessage : goalTooltipMessage;
	const tooltipMessage = isStackItem ? stackTooltipMessage : message;

	const icon = value ? <InviteTeamIcon label="Follow" /> : <UnfollowIcon label="Unfollow" />;

	const stackIconType = isProject ? 'projects' : 'goal';
	const ImportedIcon = getIcon(stackIconType);
	const stackIcon = (
		<ImportedIcon label="Follow" testId={`smart-action-follow-action-${stackIconType}-icon`} />
	);
	const followIcon: JSX.Element = isStackItem ? stackIcon : getIconFF(stackIcon, icon);

	const handleError = () => {
		const { onError: onErrorCallback } = props;

		const errorMessage = getFollowActionErrorMessage(isProject, value);

		onErrorCallback?.({
			title: <FormattedMessage {...errorMessage} />,
			appearance: 'error',
		});
	};

	return (
		<ServerAction
			content={<FormattedMessage {...label} />}
			icon={followIcon}
			testId="smart-action-follow-action"
			tooltipMessage={<FormattedMessage {...tooltipMessage} />}
			{...data}
			{...props}
			onError={handleError}
		/>
	);
};

export default FollowAction;
