import type FakerType from 'faker';

import { type TeamsClientUser as User } from '../types/user';

type MockConfig = {
	faker: typeof FakerType;
};

export const createUser = (id: string, customProps = {}): User => ({
	avatarUrl: `/ava/tar/${id}`,
	fullName: `FullName ${id}`,
	nickname: `nickname_${id}`,
	id,
	title: `job title ${id}`,
	userType: 'user',
	...customProps,
});

export const randomUser = ({ faker }: MockConfig, customProps = {}): User => ({
	avatarUrl: faker.image.avatar(),
	fullName: faker.name.findName(),
	nickname: faker.name.firstName(),
	id: faker.random.uuid(),
	title: faker.name.jobTitle(),
	userType: 'user',
	status: faker.random.arrayElement([
		'inactive',
		'closed',
		// number of active users should be large than others
		'active',
		'active',
		'active',
	]),
	...customProps,
});

export const randomUsers = (n = 10, config: MockConfig): User[] =>
	[...Array(n)].map(() => randomUser(config));

export const fixedUsers = (n = 10): User[] => {
	return [...Array(n)].map(
		(idx): User => ({
			id: `FIXED-USER-ID-${idx}`,
			avatarUrl: `https://avatar.com/${idx}`,
			fullName: `Fixed User Fullname ${idx}`,
			nickname: `fixedUserName_${idx}`,
			title: `Fixed Job Title ${idx}`,
			userType: 'user',
		}),
	);
};

export const JohnWick: User = {
	id: 'john-wick-id',
	avatarUrl: 'test-image-url',
	fullName: 'John Wick',
	nickname: 'john',
	title: 'Assassin',
	status: 'active',
	userType: 'user',
};

export const DenzelWashington: User = {
	id: 'denzel-Washington-id',
	avatarUrl: 'test-image-url',
	fullName: 'Denzel Washington',
	nickname: 'denzel',
	title: 'Actor',
	status: 'active',
	userType: 'user',
};

export const ClosedUser: User = {
	id: 'closed-user-id',
	avatarUrl: 'test-image-url',
	fullName: 'Closed user full name',
	nickname: 'closed_user',
	title: 'Dev',
	status: 'closed',
	userType: 'user',
};

export const InactiveUser: User = {
	id: 'inactive-user-id',
	avatarUrl: 'test-image-url',
	fullName: 'Inactive user full name',
	nickname: 'inactive_user',
	title: 'Hacker',
	status: 'inactive',
	userType: 'user',
};

export const AgentUser: User = {
	id: 'agent-user-id',
	avatarUrl: 'test-image-url',
	fullName: 'Agent user full name',
	nickname: 'agent_user',
	title: 'Agent',
	status: 'active',
	userType: 'agent',
};
