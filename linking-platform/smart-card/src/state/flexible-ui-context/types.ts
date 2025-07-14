import { type LinkPerson } from '@atlaskit/link-extractors';

import {
	type ActionName,
	type IconType,
	type InternalActionName,
	type MediaType,
} from '../../constants';
import { type LinkLozenge } from '../../extractors/common/lozenge/types';
import { type RetryOptions } from '../../view/FlexibleCard/types';
import { type InvokeClientActionProps } from '../hooks/use-invoke-client-action/types';
import { type InvokeRequestWithCardDetails } from '../hooks/use-invoke/types';

/**
 * This provides the data that will be used by Smart Links Flexible UI to populate it's
 * underlying elements.
 */
export type FlexibleUiDataContext = {
	/**
	 * An object containing available action on the linked resource.
	 */
	actions?: FlexibleUiActions;
	/**
	 * An array containing data used to populate the AssignedToGroup element.
	 * @see AvatarGroup
	 */
	assignedToGroup?: LinkPerson[];
	/**
	 * Contains the number of attachments on the linked resource.
	 * @type number
	 * @see AttachmentCount
	 */
	attachmentCount?: number;
	/**
	 * Contains the number of applied components on the linked resource.
	 * @type number
	 * @see AppliedToComponentsCount
	 */
	appliedToComponentsCount?: number;
	/**
	 * An array containing data used to populate the AuthorGroup element.
	 * @see AvatarGroup
	 */
	authorGroup?: LinkPerson[];

	/**
	 * A string displaying progress on a checklist
	 * @see ChecklistProgress
	 */
	checklistProgress?: string;
	/**
	 * An array containing a @type {LinkPerson} used to populate the CollaboratorGroup element.
	 * @see CollaboratorGroup
	 */
	collaboratorGroup?: LinkPerson[];
	/**
	 * Contains the number of comments of the linked resource.
	 * @type number
	 * @see CommentCount
	 */
	commentCount?: number;
	/**
	 * Contains the ISO timestamp of when the resource was due.
	 * This value is mapped to JsonLD endTime.
	 * @type string - ISO Timestamp
	 * @see DueOn
	 */
	dueOn?: string;
	/**
	 * Contains the number of views of the linked resource.
	 * @type number
	 * @see ViewCount
	 */
	viewCount?: number;
	/**
	 * Contains the number of react of the linked resource.
	 * @type number
	 * @see ReactCount
	 */
	reactCount?: number;
	/**
	 * Contains the number of votes of the linked resource.
	 * @type number
	 * @see VoteCount
	 */
	voteCount?: number;
	/**
	 * Contains the name of the entity that has the resource assigend to.
	 * @type string
	 * @see AssignedTo
	 */
	assignedTo?: string;
	/**
	 * Contains the name of the entity that created the resource.
	 * @type string
	 * @see CreatedBy
	 */
	createdBy?: string;
	/**
	 * Contains the name of the entity that owns the resource.
	 * @type string
	 * @see OwnedBy
	 */
	ownedBy?: string;
	/**
	 * Contains the person that owns the resource.
	 * @type LinkPerson
	 * @see OwnedByGroup
	 */
	ownedByGroup?: LinkPerson[];
	/**
	 * Contains the ISO timestamp of when the resource was created.
	 * @type string - ISO Timestamp
	 * @see CreatedOn
	 */
	createdOn?: string;

	/**
	 * Contains data needed to show a view action.
	 * @type ViewActionData
	 * @see ViewAction
	 */
	viewAction?: PreviewActionData;

	/**
	 * Contains the information about the latest commit in the repository
	 */
	latestCommit?: string;
	/**
	 * Contains the favicon of the resource.
	 * @type Icon
	 * @see LinkIcon
	 */
	linkIcon?: Icon;
	/**
	 * Contains the link text and url
	 */
	linkTitle?: LinkTitle;
	/**
	 * Contains the name of the entity that last modified the resource.
	 * @type string
	 * @see ModifiedBy
	 */
	modifiedBy?: string;
	/**
	 * Contains the ISO timestamp of when the resource was last modified.
	 * @type string - ISO Timestamp
	 * @see ModifiedOn
	 */
	modifiedOn?: string;
	/**
	 * Contains the preview (typically the thumbnail) of the resource.
	 * @type Media
	 * @see Preview
	 */
	preview?: Media;
	/**
	 * Contains the priority icon of the resource.
	 * @type Icon
	 * @see Priority
	 */
	priority?: Icon;
	/**
	 * Contains the programming language of the resource.
	 * @type string
	 * @see ProgrammingLanguage
	 */
	programmingLanguage?: string;
	/**
	 * Contains the provider icon of the linked resource.
	 * @type Icon
	 * @see Provider
	 */
	provider?: Icon;
	/**
	 * Contains the snippet of the resource.
	 * @type string
	 * @see Snippet
	 */
	snippet?: string;
	/**
	 * Contains read time (time taken to read) of the resource
	 */
	readTime?: string;
	/**
	 * Contains the ISO timestamp of when the resource was created.
	 * @type string - ISO Timestamp
	 * @see SentOn
	 */
	sentOn?: string;
	/**
	 * Contains the source branch name of the link typed pull request.
	 * @type string
	 * @see SourceBranch
	 */
	sourceBranch?: string;
	/**
	 * Contains the number of subscribers of the linked resource.
	 * @type number
	 * @see SubscriberCount
	 */
	subscriberCount?: number;
	/**
	 * Contains the number of team members of the linked resource.
	 * @type number
	 * @see TeamMemberCount
	 */
	teamMemberCount?: number;
	/**
	 * A string displaying progress on subtasks
	 */
	subTasksProgress?: string;
	/**
	 * Contains the number of subscribers of the linked resource.
	 * @type number
	 * @see SubscriberCount
	 */
	state?: LinkLozenge;
	/**
	 * Contains the no of story points for a task.
	 * @type string
	 * @see StoryPoints
	 */
	storyPoints?: number;
	/**
	 * Contains the target branch name of the link typed pull request.
	 * @type string
	 * @see TargetBranch
	 */
	targetBranch?: string;
	/**
	 * Contains the url of the linked resource.
	 * @type string
	 * @see Title
	 */
	url?: string;
	/**
	 * Contains the atlassian resource identifier (ARI) of the linked resource.
	 * @type string
	 * @see Title
	 */
	ari?: string;
	/**
	 * Contains the name and url of the location that the resource is located in.
	 * @type LinkLocation
	 * @see Location
	 */
	location?: LinkLocation;
	/**
	 * Contains the type provided by the link extractor.
	 * @type string
	 */
	type?: string[];
	/**
	 * Contains metadata about the linked resource.
	 */
	meta?: {
		objectId?: string;
		resourceType?: string;
		tenantId?: string;
		accessType?: string;
	};
	/**
	 * Contains user attributes information.
	 * @type JsonLd.Primitives.UserAttributes
	 * @see UserAttributes
	 */
	userAttributes?: {
		role?: string;
		department?: string;
		location?: string;
		pronouns?: string;
	};
};

export type LinkTitle = {
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	text?: string;
	url?: string;
};

export type Icon = {
	icon?: IconType;
	label?: string;
	url?: string;
};

export type LinkLocation = {
	text: string;
	url: string;
};

export type Media = {
	type: MediaType;
	url: string;
};

export type FlexibleUiActions = {
	/* Contains data needed to show a preview action that open embed modal.*/
	[ActionName.PreviewAction]?: PreviewActionData;
	[ActionName.DownloadAction]?: DownloadActionData;
	[ActionName.FollowAction]?: ServerActionProp<boolean>;
	[ActionName.CopyLinkAction]?: CopyLinkActionData;
	[InternalActionName.AISummaryAction]?: AISummaryActionData;
	[ActionName.AutomationAction]?: AutomationActionData;
	[InternalActionName.UnresolvedAction]?: UnresolvedActionData;
	[InternalActionName.ViewRelatedLinksAction]?: ViewRelatedLinksActionData;
};

export type PreviewActionData = {
	/* An action to invoke with useInvokeClientAction */
	invokeAction: InvokeClientActionProps;
};

export type DownloadActionData = {
	/* An action to invoke with useInvokeClientAction */
	invokeAction: InvokeClientActionProps;
};

export type CopyLinkActionData = {
	/* An action to invoke with useInvokeClientAction */
	invokeAction: InvokeClientActionProps;
};
export type AISummaryActionData = {
	url: string;
};

// TODO: types more specific once modal is implemented
export type AutomationActionData = {
	product: string;
	resourceType: string;
	baseAutomationUrl: string;
	objectAri: any;
	siteAri: any;
	canManageAutomation: boolean;
	analyticsSource: string;
	objectName?: string;
};

export type UnresolvedActionData = RetryOptions;

export type ViewRelatedLinksActionData = {
	ari: string;
};

export type ServerActionProp<TValue> = {
	/* A server action data used for invoke endpoint */
	action: InvokeRequestWithCardDetails;
	/* A toggle value */
	value?: TValue;
	isProject?: boolean;
};
