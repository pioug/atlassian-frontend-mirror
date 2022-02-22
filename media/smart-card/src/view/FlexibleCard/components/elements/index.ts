import { createElement } from './utils';
import { BadgeProps } from './badge/types';
import { ElementName } from '../../../../constants';
import { IconProps } from './icon/types';
import { LinkProps } from './link/types';
import { LozengeProps } from './lozenge/types';
import { AvatarGroupProps } from './avatar-group/types';
import { TextProps } from './text/types';
import { DateTimeProps } from './date-time/types';

// Attention: Keep the export name and element name the same.
// This will help reducing the code for mapping elements inside
// createElement and renderElementItems
export const AuthorGroup = createElement<AvatarGroupProps>(
  ElementName.AuthorGroup,
);
export const CollaboratorGroup = createElement<AvatarGroupProps>(
  ElementName.CollaboratorGroup,
);
export const CommentCount = createElement<BadgeProps>(ElementName.CommentCount);
export const CreatedBy = createElement<TextProps>(ElementName.CreatedBy);
export const CreatedOn = createElement<DateTimeProps>(ElementName.CreatedOn);
export const LinkIcon = createElement<IconProps>(ElementName.LinkIcon);
export const ModifiedBy = createElement<TextProps>(ElementName.ModifiedBy);
export const ModifiedOn = createElement<DateTimeProps>(ElementName.ModifiedOn);
export const Priority = createElement<BadgeProps>(ElementName.Priority);
export const ProgrammingLanguage = createElement<BadgeProps>(
  ElementName.ProgrammingLanguage,
);
export const Snippet = createElement<TextProps>(ElementName.Snippet);
export const State = createElement<LozengeProps>(ElementName.State);
export const SubscriberCount = createElement<BadgeProps>(
  ElementName.SubscriberCount,
);
export const Title = createElement<LinkProps>(ElementName.Title);
export const Provider = createElement<BadgeProps>(ElementName.Provider);
