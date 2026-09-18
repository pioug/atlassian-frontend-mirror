import { type TeamsClientUser as User } from '../types/user';
import type { MockConfig } from './user';

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
