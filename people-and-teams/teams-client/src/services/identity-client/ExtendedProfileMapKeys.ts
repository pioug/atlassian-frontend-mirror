import type { UserDetails } from './utils';

export type ExtendedProfileMapKeys = Pick<
	UserDetails,
	'title' | 'department' | 'companyName' | 'location' | 'phoneNumber' | 'aboutMe' | 'pronouns'
>;
