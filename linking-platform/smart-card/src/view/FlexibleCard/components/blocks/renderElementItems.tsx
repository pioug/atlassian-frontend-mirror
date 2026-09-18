import React from 'react';

import { type ElementName } from '../../../../constants';
import AppliedToComponentsCount from '../elements/applied-to-components-count-element';
import AssignedTo from '../elements/assigned-to-element';
import AssignedToGroup from '../elements/assigned-to-group-element';
import AttachmentCount from '../elements/attachment-count-element';
import AuthorGroup from '../elements/author-group-element';
import ChecklistProgress from '../elements/checklist-progress-element';
import CollaboratorGroup from '../elements/collaborator-group-element';
import CommentCount from '../elements/comment-count-element';
import CreatedBy from '../elements/created-by-element';
import CreatedOn from '../elements/created-on-element';
import DueOn from '../elements/due-on-element';
import HostName from '../elements/host-name-element';
import LatestCommit from '../elements/latest-commit-element';
import LinkIcon from '../elements/link-icon-element';
import Location from '../elements/location-element';
import ModifiedBy from '../elements/modified-by-element';
import ModifiedOn from '../elements/modified-on-element';
import OwnedBy from '../elements/owned-by-element';
import OwnedByGroup from '../elements/owned-by-group-element';
import Preview from '../elements/preview-element';
import Priority from '../elements/priority-element';
import ProgrammingLanguage from '../elements/programming-language-element';
import Provider from '../elements/provider-element';
import ReactCount from '../elements/react-count-element';
import ReadTime from '../elements/read-time-element';
import SentOn from '../elements/sent-on-element';
import Snippet from '../elements/snippet-element';
import SourceBranch from '../elements/source-branch-element';
import State from '../elements/state-element';
import StoryPoints from '../elements/story-points-element';
import SubTasksProgress from '../elements/sub-tasks-progress-element';
import SubscriberCount from '../elements/subscriber-count-element';
import TargetBranch from '../elements/target-branch-element';
import TeamMemberCount from '../elements/team-member-count-element';
import Title from '../elements/title-element';
import UserAttributes from '../elements/user-attributes-element';
import ViewCount from '../elements/view-count-element';
import VoteCount from '../elements/vote-count-element';
import { isJSXElementNull } from './isJSXElementNull';
import { type ElementItem } from './types';
import { ElementDisplaySchema } from './utils';
import type { ElementDisplaySchemaType } from './utils';

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

const isElementDisplayValid = (name: ElementName, display: ElementDisplaySchemaType): boolean => {
	return ElementDisplaySchema[name]?.includes(display) ?? false;
};

export const renderElementItems = (
	items: ElementItem[] = [],
	display: ElementDisplaySchemaType = 'inline',
): React.ReactNode | undefined => {
	const elements = items.reduce((acc: React.ReactElement[], curr: ElementItem, idx: number) => {
		const { name, ...props } = curr;
		const Element = Elements[name];
		const typedProps = props as any;
		if (Element && isElementDisplayValid(name, display)) {
			const element = <Element key={idx} {...typedProps} />;
			if (!isJSXElementNull(element)) {
				return [...acc, element];
			}
		}
		return acc;
	}, []);

	if (elements.length) {
		return elements;
	}
};
