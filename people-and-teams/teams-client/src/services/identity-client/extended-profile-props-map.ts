import type { ExtendedProfileMapKey } from './ExtendedProfileMapKey';
import type { IdentityProfileData } from './IdentityProfileData';

// Key (left-side) is field name which is used in our app.
// Value (right-side) is field name which is used by data in services
export const EXTENDED_PROFILE_PROPS_MAP: Map<
	ExtendedProfileMapKey,
	keyof IdentityProfileData['extended_profile']
> = new Map([
	['title', 'job_title'],
	['department', 'department'],
	['companyName', 'organization'],
	['location', 'location'],
	['phoneNumber', 'phone_number'],
	['aboutMe', 'about_me'],
	['pronouns', 'pronouns'],
]);
