import { UserType } from './types';
import type { MentionDescription } from './types';

export function isSpecialMention(mention: MentionDescription): boolean {
	return !!mention.userType && mention.userType === UserType[UserType.SPECIAL];
}
