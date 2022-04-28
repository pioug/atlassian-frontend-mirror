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

// Attention: Keep the export name and element name the same.
// This will help reducing the code for mapping elements inside
// createElement and renderElementItems
/**
 * Creates an AvatarGroup element using the data from AuthorGroup in the Flexible UI Context.
 * @see AvatarGroup
 */
export const AuthorGroup = createElement<AvatarGroupProps>(
  ElementName.AuthorGroup,
);
/**
 * Creates an AvatarGroup element using the data from CollaboratorGroup in the Flexible UI Context.
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
 * Creates a ViewCount Badge element using the data from ViewCount in the Flexible UI Context.
 * @see Badge
 */
export const ViewCount = createElement<BadgeProps>(ElementName.ViewCount);
/**
 * Creates a ReactCount Badge element using the data from ReactCount in the Flexible UI Context.
 * @see Badge
 */
export const ReactCount = createElement<BadgeProps>(ElementName.ReactCount);
/**
 * Creates a VoteCount Badge element using the data from VoteCount in the Flexible UI Context.
 * @see Badge
 */
export const VoteCount = createElement<BadgeProps>(ElementName.VoteCount);
/**
 * Creates a CreatedBy text element using the data from CreatedBy in the Flexible UI Context.
 * @see Text
 */
export const CreatedBy = createElement<TextProps>(ElementName.CreatedBy);
/**
 * Creates a CreatedOn DateTime element using the data from CreatedOn in the Flexible UI Context.
 * @see DateTime
 */
export const CreatedOn = createElement<DateTimeProps>(ElementName.CreatedOn);
/**
 * Creates a LinkIcon Icon element using the data from LinkIcon in the Flexible UI Context.
 * @see Icon
 */
export const LinkIcon = createElement<IconProps>(ElementName.LinkIcon);
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
 * Creates a Snippet element using the data from Snippet in the Flexible UI Context.
 * @see Text
 */
export const Snippet = createElement<TextProps>(ElementName.Snippet);
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
 * Creates a Title Link element using the data from Title in the Flexible UI Context.
 * This represents the main link text within the Smart Link.
 * @see Link
 */
export const Title = createElement<LinkProps>(ElementName.Title);
/**
 * Creates a Provider Badge element using the data from Provider in the Flexible UI Context.
 * @see Badge
 */
export const Provider = createElement<BadgeProps>(ElementName.Provider);
