import type { UserDetails } from './utils';

export type ProfileMapKeys = Pick<
	UserDetails,
	'id' | 'fullName' | 'nickname' | 'timezone' | 'locale' | 'avatarUrl' | 'email'
>;
