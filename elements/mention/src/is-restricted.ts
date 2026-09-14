import { UserAccessLevel } from './types';

export function isRestricted(accessLevel?: string): boolean {
	return !!accessLevel && accessLevel === UserAccessLevel[UserAccessLevel.NONE];
}
