import { ElementName, type SmartLinkSize } from '../../../../constants';

import {
	type BaseAtlaskitBadgeElementProps,
	type BaseAvatarGroupElementProps,
	type BaseBadgeElementProps,
	type BaseDateTimeElementProps,
	type BaseIconElementProps,
	type BaseLinkElementProps,
	type BaseLozengeElementProps,
	type BaseTextElementProps,
} from './common';
import { createElement } from './utils';

export type ElementProps = {
	/**
	 * Name of the element, can be used as a selector.
	 * E.g. [data-smart-element="Provider"]
	 * @internal
	 */
	name?: ElementName;
	/**
	 * For compiled css
	 */
	className?: string;
	/**
	 * The size of the element to display.
	 */
	size?: SmartLinkSize;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};

/**
 * @note The intention is to replace all the exports below with an import from
 * the direct files when `createElement` is deleted.
 * This changes should be made when FG platform-linking-flexible-card-elements-refactor
 * is cleaned up
 */

// Attention: Keep the export name and element name the same.
// This will help reducing the code for mapping elements inside
// createElement and renderElementItems
/**
 * Creates a AssignedTo text element using the data from AssignedTo in the Flexible UI Context.
 * @see Text
 */
export const AssignedTo = createElement<BaseTextElementProps>(ElementName.AssignedTo);
// For example, this should be replaced with
// export { default * AssignedTo } from "./assigned-to-element"

/**
 * An AvatarGroup element using the data from AssignedToGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const AssignedToGroup = createElement<BaseAvatarGroupElementProps>(
	ElementName.AssignedToGroup,
);
/**
 * Creates a AttachmentCount Badge element using the data from AttachmentCount in the Flexible UI Context.
 * @see Badge
 */
export const AttachmentCount = createElement<BaseBadgeElementProps>(ElementName.AttachmentCount);
/**
 * An AvatarGroup element using the data from AuthorGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const AuthorGroup = createElement<BaseAvatarGroupElementProps>(ElementName.AuthorGroup);
/**
 * Creates a Checklist Badge element using the data from ChecklistProgress in the Flexible UI Context.
 * @see Badge
 */
export const ChecklistProgress = createElement<BaseBadgeElementProps>(
	ElementName.ChecklistProgress,
);
/**
 * An AvatarGroup element using the data from CollaboratorGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const CollaboratorGroup = createElement<BaseAvatarGroupElementProps>(
	ElementName.CollaboratorGroup,
);
/**
 * Creates a CommentCount Badge element using the data from CommentCount in the Flexible UI Context.
 * @see Badge
 */
export const CommentCount = createElement<BaseBadgeElementProps>(ElementName.CommentCount);
/**
 * Creates a CreatedOn DateTime element using the data from CreatedOn in the Flexible UI Context.
 * @see DateTime
 */
export const CreatedOn = createElement<BaseDateTimeElementProps>(ElementName.CreatedOn);
/**
 * Creates a CreatedBy text element using the data from CreatedBy in the Flexible UI Context.
 * @see Text
 */
export const CreatedBy = createElement<BaseTextElementProps>(ElementName.CreatedBy);
/**
 * Creates a DueOn Lozenge element using the data from dueOn in the Flexible UI Context.
 * @see Lozenge
 */
export const DueOn = createElement<BaseLozengeElementProps>(ElementName.DueOn);
/**
 * Creates an element that contains Last Commit hash
 */
export const LatestCommit = createElement<BaseBadgeElementProps>(ElementName.LatestCommit);
/**
 * Creates a LinkIcon Icon element using the data from LinkIcon in the Flexible UI Context.
 * @see Icon
 */
export const LinkIcon = createElement<BaseIconElementProps>(ElementName.LinkIcon);
/**
 * Creates a Location Link element.
 * This represents the location or container of the resource.
 * @see Link
 */
export const Location = createElement<BaseLinkElementProps>(ElementName.Location);
/**
 * Creates a ModifiedBy Text element using the data from ModifiedBy in the Flexible UI Context.
 * @see Text
 */
export const ModifiedBy = createElement<BaseTextElementProps>(ElementName.ModifiedBy);
/**
 * Creates a ModifiedOn DateTime element using the data from ModifiedOn in the Flexible UI Context.
 * @see DateTime
 */
export const ModifiedOn = createElement<BaseDateTimeElementProps>(ElementName.ModifiedOn);
/**
 * Creates a OwnedBy text element using the data from OwnedBy in the Flexible UI Context.
 * @see Text
 */
export const OwnedBy = createElement<BaseTextElementProps>(ElementName.OwnedBy);
/**
 * An AvatarGroup element using the data from OwnedByGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const OwnedByGroup = createElement<BaseAvatarGroupElementProps>(ElementName.OwnedByGroup);
/**
 * Creates a Preview element using the data from Preview in the Flexible UI Context.
 * @see Preview
 */
export { default as Preview } from './preview-element';
/**
 * Creates a Priority Badge element using the data from Priority in the Flexible UI Context.
 * @see Badge
 */
export const Priority = createElement<BaseBadgeElementProps>(ElementName.Priority);
/**
 * Creates a ProgrammingLanguage Badge element using the data from ProgrammingLanguage in the Flexible UI Context.
 * @see Badge
 */
export const ProgrammingLanguage = createElement<BaseBadgeElementProps>(
	ElementName.ProgrammingLanguage,
);
/**
 * Creates a Provider Badge element using the data from Provider in the Flexible UI Context.
 * @see Badge
 */
export const Provider = createElement<BaseBadgeElementProps>(ElementName.Provider);
/**
 * Creates a ReactCount Badge element using the data from ReactCount in the Flexible UI Context.
 * @see Badge
 */
export const ReactCount = createElement<BaseBadgeElementProps>(ElementName.ReactCount);
/**
 * Creates a ReadTime Text element using the data from readTime in the Flexible UI Context
 */
export const ReadTime = createElement<BaseTextElementProps>(ElementName.ReadTime);
/**
 * Creates a SentOn DateTime element using the data from SentOn in the Flexible UI Context.
 * @see DateTime
 */
export const SentOn = createElement<BaseDateTimeElementProps>(ElementName.SentOn);
/**
 * Creates a Snippet element using the data from Snippet in the Flexible UI Context.
 * @see Text
 */
export { default as Snippet } from './snippet-element';
/**
 * Creates a SourceBranch Text element using the data from sourceBranch in the Flexible UI Context.
 * @see Text
 */
export const SourceBranch = createElement<BaseTextElementProps>(ElementName.SourceBranch);
/**
 * Creates a State Lozenge element using the data from State in the Flexible UI Context.
 * @see Lozenge
 */
export const State = createElement<BaseLozengeElementProps>(ElementName.State);
/**
 * Creates a SubscriberCount Badge element using the data from SubscriberCount in the Flexible UI Context.
 * @see Badge
 */
export const SubscriberCount = createElement<BaseBadgeElementProps>(ElementName.SubscriberCount);
/**
 * Create a SubTasks Badge element using the data from subTasks in the Flexible UI Context.
 * @see Badge
 */
export const SubTasksProgress = createElement<BaseBadgeElementProps>(ElementName.SubTasksProgress);
/**
 * Create a StoryPoints Badge element using the data from storyPoints in the Flexible UI Context.
 * @see AtlaskitBadge
 */
export const StoryPoints = createElement<BaseAtlaskitBadgeElementProps>(ElementName.StoryPoints);
/**
 * Creates a TargetBranch Text element using the data from targetBranch in the Flexible UI Context.
 * @see Text
 */
export const TargetBranch = createElement<BaseTextElementProps>(ElementName.TargetBranch);
/**
 * Creates a Title Link element using the data from Title in the Flexible UI Context.
 * This represents the main link text within the Smart Link.
 * @see Link
 */
export const Title = createElement<BaseLinkElementProps>(ElementName.Title);
/**
 * Creates a ViewCount Badge element using the data from ViewCount in the Flexible UI Context.
 * @see Badge
 */
export const ViewCount = createElement<BaseBadgeElementProps>(ElementName.ViewCount);
/**
 * Creates a VoteCount Badge element using the data from VoteCount in the Flexible UI Context.
 * @see Badge
 */
export const VoteCount = createElement<BaseBadgeElementProps>(ElementName.VoteCount);

export { default as AppliedToComponentsCount } from './applied-to-components-count-element';
