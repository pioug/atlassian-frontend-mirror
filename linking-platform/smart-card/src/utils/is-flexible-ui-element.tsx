import React from 'react';

import AppliedToComponentsCount from '../view/FlexibleCard/components/elements/applied-to-components-count-element';
import AssignedTo from '../view/FlexibleCard/components/elements/assigned-to-element';
import AssignedToGroup from '../view/FlexibleCard/components/elements/assigned-to-group-element';
import AttachmentCount from '../view/FlexibleCard/components/elements/attachment-count-element';
import AuthorGroup from '../view/FlexibleCard/components/elements/author-group-element';
import ChecklistProgress from '../view/FlexibleCard/components/elements/checklist-progress-element';
import CollaboratorGroup from '../view/FlexibleCard/components/elements/collaborator-group-element';
import CommentCount from '../view/FlexibleCard/components/elements/comment-count-element';
import CreatedBy from '../view/FlexibleCard/components/elements/created-by-element';
import CreatedOn from '../view/FlexibleCard/components/elements/created-on-element';
import DueOn from '../view/FlexibleCard/components/elements/due-on-element';
import HostName from '../view/FlexibleCard/components/elements/host-name-element';
import LatestCommit from '../view/FlexibleCard/components/elements/latest-commit-element';
import LinkIcon from '../view/FlexibleCard/components/elements/link-icon-element';
import Location from '../view/FlexibleCard/components/elements/location-element';
import ModifiedBy from '../view/FlexibleCard/components/elements/modified-by-element';
import ModifiedOn from '../view/FlexibleCard/components/elements/modified-on-element';
import OwnedBy from '../view/FlexibleCard/components/elements/owned-by-element';
import OwnedByGroup from '../view/FlexibleCard/components/elements/owned-by-group-element';
import Preview from '../view/FlexibleCard/components/elements/preview-element';
import Priority from '../view/FlexibleCard/components/elements/priority-element';
import ProgrammingLanguage from '../view/FlexibleCard/components/elements/programming-language-element';
import Provider from '../view/FlexibleCard/components/elements/provider-element';
import ReactCount from '../view/FlexibleCard/components/elements/react-count-element';
import ReadTime from '../view/FlexibleCard/components/elements/read-time-element';
import SentOn from '../view/FlexibleCard/components/elements/sent-on-element';
import Snippet from '../view/FlexibleCard/components/elements/snippet-element';
import SourceBranch from '../view/FlexibleCard/components/elements/source-branch-element';
import State from '../view/FlexibleCard/components/elements/state-element';
import StoryPoints from '../view/FlexibleCard/components/elements/story-points-element';
import SubTasksProgress from '../view/FlexibleCard/components/elements/sub-tasks-progress-element';
import SubscriberCount from '../view/FlexibleCard/components/elements/subscriber-count-element';
import TargetBranch from '../view/FlexibleCard/components/elements/target-branch-element';
import TeamMemberCount from '../view/FlexibleCard/components/elements/team-member-count-element';
import Title from '../view/FlexibleCard/components/elements/title-element';
import UserAttributes from '../view/FlexibleCard/components/elements/user-attributes-element';
import ViewCount from '../view/FlexibleCard/components/elements/view-count-element';
import VoteCount from '../view/FlexibleCard/components/elements/vote-count-element';
import { isStyleCacheProvider } from './is-style-cache-provider';

const Elements = {
	AppliedToComponentsCount,
	AssignedTo,
	AssignedToGroup,
	AttachmentCount,
	AuthorGroup,
	ChecklistProgress,
	CollaboratorGroup,
	CommentCount,
	CreatedBy,
	CreatedOn,
	DueOn,
	HostName,
	LatestCommit,
	LinkIcon,
	Location,
	ModifiedBy,
	ModifiedOn,
	OwnedBy,
	OwnedByGroup,
	Preview,
	Priority,
	ProgrammingLanguage,
	Provider,
	ReactCount,
	ReadTime,
	SentOn,
	Snippet,
	SourceBranch,
	State,
	StoryPoints,
	SubTasksProgress,
	SubscriberCount,
	TargetBranch,
	TeamMemberCount,
	Title,
	UserAttributes,
	ViewCount,
	VoteCount,
};

export const isFlexibleUiElement = (node: React.ReactNode): boolean => {
	if (!React.isValidElement(node)) {
		return false;
	}

	if (Object.values(Elements).some((type) => type === node.type)) {
		return true;
	}

	if (isStyleCacheProvider(node)) {
		// Component wrapped with compiled at runtime, check for children
		let isChildrenValid = true;
		React.Children.map(node.props.children, (child) => {
			if (!React.isValidElement(child)) {
				isChildrenValid = false;
				return;
			}

			if (typeof child.type !== 'string' && child.type?.name !== 'Style') {
				isChildrenValid = isFlexibleUiElement(child);
			}
		});
		return isChildrenValid;
	}
	return false;
};
