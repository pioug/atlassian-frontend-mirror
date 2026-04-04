import faker from 'faker';

export const MOCK_TEAM: {
	team: {
		teamV2: {
			members: {
				edges: {
					node: {
						member: {
							id: string;
							name: string;
							picture: string;
							accountStatus: string;
							extendedProfile: {
								jobTitle: string;
							};
						};
						state: string;
						role: string;
					};
				}[];
				pageInfo: {
					hasNextPage: boolean;
					endCursor: string;
				};
			};
		};
	};
} = {
	team: {
		teamV2: {
			members: {
				edges: [
					{
						node: {
							member: {
								id: 'ari:cloud:identity::user/1',
								name: 'user1',
								picture: 'url1',
								accountStatus: 'active',
								extendedProfile: {
									jobTitle: 'CPA - Chief Party Animal',
								},
							},
							state: 'FULL_MEMBER',
							role: 'REGULAR',
						},
					},
					{
						node: {
							member: {
								id: 'ari:cloud:identity::user/2',
								name: 'user2',
								picture: 'url2',
								accountStatus: 'active',
								extendedProfile: {
									jobTitle: 'Deputy Party Animal',
								},
							},
							state: 'FULL_MEMBER',
							role: 'REGULAR',
						},
					},
				],
				pageInfo: {
					hasNextPage: false,
					endCursor: 'end',
				},
			},
		},
	},
};

export const MOCK_USER: {
	user: {
		name: string;
		picture: string;
		accountStatus: string;
		__typename: string;
		email: string;
		nickname: string;
		locale: string;
		zoneinfo: string;
		extendedProfile: {
			jobTitle: string;
			organization: string;
			department: string;
			location: string;
			phoneNumbers: string;
			closedDate: Date;
			inactiveDate: Date;
		};
		id: string;
	};
} = {
	user: {
		name: faker.name.findName(),
		picture: faker.image.avatar(),
		accountStatus: 'active',
		__typename: 'AtlassianAccountUser',
		email: 'test_user@atlassian.com',
		nickname: faker.name.findName(),
		locale: 'en-GB',
		zoneinfo: 'Australia/Sydney',
		extendedProfile: {
			jobTitle: faker.name.jobTitle(),
			organization: faker.company.companyName(),
			department: faker.company.companyName(),
			location: faker.address.city(),
			phoneNumbers: faker.phone.phoneNumber(),
			closedDate: faker.date.past(),
			inactiveDate: faker.date.past(),
		},
		id: faker.random.uuid(),
	},
};
