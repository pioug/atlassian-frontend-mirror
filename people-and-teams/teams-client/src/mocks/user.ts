import type FakerType from 'faker';

import { type TeamsClientUser as User } from '../types/user';

export type MockConfig = {
	faker: typeof FakerType;
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
