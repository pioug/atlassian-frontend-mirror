import { type TeamMember, type TeamWithMemberships } from '../types/membership';
import { type TeamWithImageUrls } from '../types/team';

import { randomUser } from './random-user';
import type { MockConfig } from './team';

const generateTeamMembers =
	({ faker }: MockConfig) =>
	(n?: number): TeamMember[] => {
		const count = n || Math.ceil(Math.random() * 20);
		const members = new Array<TeamMember>(count);
		for (let i = 0; i < count; i++) {
			const user = randomUser({ faker });
			members.push({
				id: user.id,
				fullName: user.fullName,
				avatarUrl: user.avatarUrl,
				status: user.status,
			});
		}
		return members;
	};

export const randomTeamWithMemberships =
	({ faker }: MockConfig) =>
	(team: TeamWithImageUrls, customProps = {}): TeamWithMemberships => {
		let members;
		if (team.membership && team.membership.members) {
			members = team.membership.members.map((member) => ({
				id: member.user!.id,
				fullName: member.user!.fullName,
				avatarUrl: member.user!.avatarUrl,
				status: member.user!.status,
			}));
		} else {
			members = generateTeamMembers({ faker })();
		}
		return {
			...team,
			members,
			memberCount: members.length,
			includesYou: faker.random.boolean(),
			...customProps,
		};
	};
