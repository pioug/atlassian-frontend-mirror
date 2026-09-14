import { UserType } from './types';
import type { MentionDescription } from './types';

export function isTeamMention(mention: MentionDescription): boolean | '' | undefined {
	return mention.userType && mention.userType === UserType[UserType.TEAM];
}
