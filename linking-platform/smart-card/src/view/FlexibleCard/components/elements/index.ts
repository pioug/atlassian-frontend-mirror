import { createElement } from './utils';
import { BadgeProps } from './badge/types';
import { ElementName } from '../../../../constants';
import { IconProps } from './icon/types';
import { LinkProps } from './link/types';
import { LozengeProps } from './lozenge/types';
import { AvatarGroupProps } from './avatar-group/types';
import { TextProps } from './text/types';
import { DateTimeProps } from './date-time/types';
import { MediaProps } from './media/types';
import { AtlaskitBadgeProps } from './atlaskit-badge/types';

// Attention: Keep the export name and element name the same.
// This will help reducing the code for mapping elements inside
// createElement and renderElementItems
/**
 * Creates a AssignedTo text element using the data from AssignedTo in the Flexible UI Context.
 * @see Text
 */
export const AssignedTo = createElement<TextProps>(ElementName.AssignedTo);
/**
 * An AvatarGroup element using the data from AssignedToGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const AssignedToGroup = createElement<AvatarGroupProps>(
  ElementName.AssignedToGroup,
);
/**
 * Creates a AttachmentCount Badge element using the data from AttachmentCount in the Flexible UI Context.
 * @see Badge
 */
export const AttachmentCount = createElement<BadgeProps>(
  ElementName.AttachmentCount,
);
/**
 * An AvatarGroup element using the data from AuthorGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const AuthorGroup = createElement<AvatarGroupProps>(
  ElementName.AuthorGroup,
);
/**
 * Creates a Checklist Badge element using the data from ChecklistProgress in the Flexible UI Context.
 * @see Badge
 */
export const ChecklistProgress = createElement<BadgeProps>(
  ElementName.ChecklistProgress,
);
/**
 * An AvatarGroup element using the data from CollaboratorGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const CollaboratorGroup = createElement<AvatarGroupProps>(
  ElementName.CollaboratorGroup,
);
/**
 * Creates a CommentCount Badge element using the data from CommentCount in the Flexible UI Context.
 * @see Badge
 */
export const CommentCount = createElement<BadgeProps>(ElementName.CommentCount);
/**
 * Creates a CreatedOn DateTime element using the data from CreatedOn in the Flexible UI Context.
 * @see DateTime
 */
export const CreatedOn = createElement<DateTimeProps>(ElementName.CreatedOn);
/**
 * Creates a CreatedBy text element using the data from CreatedBy in the Flexible UI Context.
 * @see Text
 */
export const CreatedBy = createElement<TextProps>(ElementName.CreatedBy);
/**
 * Creates a DueOn Lozenge element using the data from dueOn in the Flexible UI Context.
 * @see Lozenge
 */
export const DueOn = createElement<LozengeProps>(ElementName.DueOn);
/**
 * Creates an element that contains Last Commit hash
 */
export const LatestCommit = createElement<BadgeProps>(ElementName.LatestCommit);
/**
 * Creates a LinkIcon Icon element using the data from LinkIcon in the Flexible UI Context.
 * @see Icon
 */
export const LinkIcon = createElement<IconProps>(ElementName.LinkIcon);
/**
 * Creates a Location Link element.
 * This represents the location or container of the resource.
 * @see Link
 */
export const Location = createElement<LinkProps>(ElementName.Location);
/**
 * Creates a ModifiedBy Text element using the data from ModifiedBy in the Flexible UI Context.
 * @see Text
 */
export const ModifiedBy = createElement<TextProps>(ElementName.ModifiedBy);
/**
 * Creates a ModifiedOn DateTime element using the data from ModifiedOn in the Flexible UI Context.
 * @see DateTime
 */
export const ModifiedOn = createElement<DateTimeProps>(ElementName.ModifiedOn);
/**
 * Creates a OwnedBy text element using the data from OwnedBy in the Flexible UI Context.
 * @see Text
 */
export const OwnedBy = createElement<TextProps>(ElementName.OwnedBy);
/**
 * An AvatarGroup element using the data from OwnedByGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const OwnedByGroup = createElement<AvatarGroupProps>(
  ElementName.OwnedByGroup,
);
/**
 * Creates a Preview element using the data from Preview in the Flexible UI Context.
 * @see Preview
 */
export const Preview = createElement<MediaProps>(ElementName.Preview);
/**
 * Creates a Priority Badge element using the data from Priority in the Flexible UI Context.
 * @see Badge
 */
export const Priority = createElement<BadgeProps>(ElementName.Priority);
/**
 * Creates a ProgrammingLanguage Badge element using the data from ProgrammingLanguage in the Flexible UI Context.
 * @see Badge
 */
export const ProgrammingLanguage = createElement<BadgeProps>(
  ElementName.ProgrammingLanguage,
);
/**
 * Creates a Provider Badge element using the data from Provider in the Flexible UI Context.
 * @see Badge
 */
export const Provider = createElement<BadgeProps>(ElementName.Provider);
/**
 * Creates a ReactCount Badge element using the data from ReactCount in the Flexible UI Context.
 * @see Badge
 */
export const ReactCount = createElement<BadgeProps>(ElementName.ReactCount);
/**
 * Creates a ReadTime Text element using the data from readTime in the Flexible UI Context
 */
export const ReadTime = createElement<TextProps>(ElementName.ReadTime);
/**
 * Creates a Snippet element using the data from Snippet in the Flexible UI Context.
 * @see Text
 */
export const Snippet = createElement<TextProps>(ElementName.Snippet);
/**
 * Creates a SourceBranch Text element using the data from sourceBranch in the Flexible UI Context.
 * @see Text
 */
export const SourceBranch = createElement<TextProps>(ElementName.SourceBranch);
/**
 * Creates a State Lozenge element using the data from State in the Flexible UI Context.
 * @see Lozenge
 */
export const State = createElement<LozengeProps>(ElementName.State);
/**
 * Creates a SubscriberCount Badge element using the data from SubscriberCount in the Flexible UI Context.
 * @see Badge
 */
export const SubscriberCount = createElement<BadgeProps>(
  ElementName.SubscriberCount,
);
/**
 * Create a SubTasks Badge element using the data from subTasks in the Flexible UI Context.
 * @see Badge
 */
export const SubTasksProgress = createElement<BadgeProps>(
  ElementName.SubTasksProgress,
);
/**
 * Create a StoryPoints Badge element using the data from storyPoints in the Flexible UI Context.
 * @see AtlaskitBadge
 */
export const StoryPoints = createElement<AtlaskitBadgeProps>(
  ElementName.StoryPoints,
);
/**
 * Creates a TargetBranch Text element using the data from targetBranch in the Flexible UI Context.
 * @see Text
 */
export const TargetBranch = createElement<TextProps>(ElementName.TargetBranch);
/**
 * Creates a Title Link element using the data from Title in the Flexible UI Context.
 * This represents the main link text within the Smart Link.
 * @see Link
 */
export const Title = createElement<LinkProps>(ElementName.Title);
/**
 * Creates a ViewCount Badge element using the data from ViewCount in the Flexible UI Context.
 * @see Badge
 */
export const ViewCount = createElement<BadgeProps>(ElementName.ViewCount);
/**
 * Creates a VoteCount Badge element using the data from VoteCount in the Flexible UI Context.
 * @see Badge
 */
export const VoteCount = createElement<BadgeProps>(ElementName.VoteCount);
