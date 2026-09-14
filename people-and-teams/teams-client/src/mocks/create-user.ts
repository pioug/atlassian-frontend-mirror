import { type TeamsClientUser as User } from '../types/user';

export const createUser = (id: string, customProps = {}): User => ({
	avatarUrl: `/ava/tar/${id}`,
	fullName: `FullName ${id}`,
	nickname: `nickname_${id}`,
	id,
	title: `job title ${id}`,
	userType: 'user',
	...customProps,
});
