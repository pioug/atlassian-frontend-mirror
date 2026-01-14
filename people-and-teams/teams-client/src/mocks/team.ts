import type FakerType from 'faker';
import times from 'lodash/times';

import {
	type TeamMember,
	type TeamMembership,
	type TeamWithMemberships,
} from '../types/membership';
import { type Team, type TeamAvatarImage, type TeamWithImageUrls } from '../types/team';

import { randomUser } from './user';

type MockConfig = {
	faker: typeof FakerType;
};

const headerImages = [
	'https://images.unsplash.com/photo-1533589067335-b0114bd0ab00?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=44f82f3cfd94db0ed8ad35737bb25fe4&auto=format&fit=crop&w=3469&q=80',
	'https://images.unsplash.com/photo-1519118886560-fbbb446660a4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b568db5fad0ec1b0abf8e230662f277c&auto=format&fit=crop&w=3450&q=80',
	'https://images.unsplash.com/photo-1506316940527-4d1c138978a0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6952c5da84bed2f5cad7c9e41474c890&auto=format&fit=crop&w=4178&q=80',
	'https://images.unsplash.com/photo-1505872472933-3657fd5f0aa3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f55798af8783753567bbe1a2859f9125&auto=format&fit=crop&w=800&q=60',
	'https://images.unsplash.com/photo-1508542373453-6d6aaf71d9b5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=17d8767fe0f213017c5a248f46708004&auto=format&fit=crop&w=3450&q=80',
	'https://images.unsplash.com/photo-1505343011179-ffb744ab9bef?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c038482c22e9eccc547a9b8b30d03d6b&auto=format&fit=crop&w=3449&q=80',
	'//noimage.jpg',
];

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

export const randomTeamMembership =
	({ faker }: MockConfig) =>
	(customProps = {}): TeamMembership => {
		const user = randomUser({ faker });

		return {
			state: faker.random.arrayElement(['FULL_MEMBER', 'ALUMNI', 'REQUESTING_TO_JOIN']),
			user,
			membershipId: {
				teamId: faker.random.uuid(),
				memberId: user.id,
			},
			role: faker.random.arrayElement(['ADMIN', 'REGULAR']),
			...customProps,
		};
	};

export const randomTeamMemberships =
	(config: MockConfig) =>
	(n = 10, customProps = {}): TeamMembership[] =>
		times<TeamMembership>(n, () => {
			return {
				...randomTeamMembership(config)(customProps),
			};
		});

export const randomHeaderImage =
	({ faker }: MockConfig) =>
	(): string => {
		if (Math.random() > 0.5) {
			return faker.random.arrayElement(headerImages);
		} else {
			return `270deg, #FFF0B3 0%, #FFC400 100%`;
		}
	};

export const randomTeamImages =
	({ faker }: MockConfig) =>
	(customImage?: string): TeamAvatarImage => {
		const headerImage = customImage || randomHeaderImage({ faker })();

		return {
			largeAvatarImageUrl: headerImage,
			smallAvatarImageUrl: headerImage,
			largeHeaderImageUrl: headerImage,
			smallHeaderImageUrl: headerImage,
		};
	};

export const randomBasicTeam =
	({ faker }: MockConfig) =>
	(customProps = {}): Team => ({
		id: faker.random.uuid(),
		displayName: faker.company.companyName(),
		description: faker.company.catchPhrase(),
		state: faker.random.arrayElement(['ACTIVE', 'PURGED']),
		membershipSettings: faker.random.arrayElement(['OPEN', 'MEMBER_INVITE']),
		restriction: faker.random.arrayElement(['ORG_MEMBERS', 'NO_RESTRICTION']),
		...customProps,
	});

export const randomFullTeam =
	({ faker }: MockConfig) =>
	(customProps = {}): TeamWithImageUrls => {
		const teamMemberships = randomTeamMemberships({ faker })();

		return {
			...randomBasicTeam({ faker })({
				organizationId: faker.random.uuid(),
				creatorId: faker.random.uuid(),
				permission: faker.random.arrayElement(['FULL_WRITE', 'FULL_READ']),
				creatorDomain: faker.random.word(),
				memberIds: teamMemberships.map((teamMembership) => teamMembership.membershipId.memberId),
				membership: {
					members: teamMemberships,
					errors: [],
				},
				orgId: faker.random.uuid(),

				...customProps,
			}),
			...randomTeamImages({ faker })(),
		};
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
