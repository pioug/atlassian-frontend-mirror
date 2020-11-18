import { MentionDescription } from '@atlaskit/mention';
import { INVITE_ITEM_DESCRIPTION } from './ui/InviteItem';

export const isTeamType = (userType: any): Boolean => userType === 'TEAM';

export const isTeamStats = (stat: any): Boolean =>
  stat && !isNaN(stat.teamMentionDuration);

export const isInviteItem = (mention: MentionDescription): Boolean =>
  mention && mention.id === INVITE_ITEM_DESCRIPTION.id;
