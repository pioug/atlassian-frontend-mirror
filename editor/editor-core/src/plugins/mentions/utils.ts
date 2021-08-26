import { MentionDescription } from '@atlaskit/mention';
import { INVITE_ITEM_DESCRIPTION } from './ui/InviteItem';

export const isTeamType = (userType: any): Boolean => userType === 'TEAM';

export const isTeamStats = (stat: any): Boolean =>
  stat && !isNaN(stat.teamMentionDuration);

export const isInviteItem = (mention: MentionDescription): Boolean =>
  mention && mention.id === INVITE_ITEM_DESCRIPTION.id;

/**
 * Actions
 */
export const shouldKeepInviteItem = (
  query: string,
  firstQueryWithoutResults: string,
): boolean => {
  if (!firstQueryWithoutResults) {
    return true;
  }
  let lastIndexWithResults = firstQueryWithoutResults.length - 1;
  let suffix = query.slice(lastIndexWithResults);
  if (query[lastIndexWithResults - 1] === ' ') {
    suffix = ' ' + suffix;
  }
  const depletedExtraWords = /\s[^\s]+\s/.test(suffix);
  return !depletedExtraWords;
};
