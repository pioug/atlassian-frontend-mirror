import type { IdentityProfileData } from './IdentityProfileData';
import type { ProfileMapKey } from './ProfileMapKey';

// Key (left-side) is field name which is used in our app.
// Value (right-side) is field name which is used by data in services
export const PROFILE_PROPS_MAP: Map<
	ProfileMapKey,
	keyof Omit<IdentityProfileData, 'extended_profile'>
> = new Map([
	['id', 'account_id'],
	['fullName', 'name'],
	['nickname', 'nickname'],
	['timezone', 'zoneinfo'],
	['locale', 'locale'],
	['avatarUrl', 'picture'],
	['email', 'email'],
]);
