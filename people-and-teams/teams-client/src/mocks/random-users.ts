import { type TeamsClientUser as User } from '../types/user';
import { randomUser } from './random-user';
import type { MockConfig } from './user';

export const randomUsers = (n = 10, config: MockConfig): User[] =>
	[...Array(n)].map(() => randomUser(config));
