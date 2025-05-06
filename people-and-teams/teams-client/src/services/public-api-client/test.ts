import faker from 'faker';

import { RestClient } from '../rest-client';

import defaultPublicApiClient from './index';

jest.mock('../rest-client', () => {
	const ActualRestClient = jest.requireActual('../rest-client');

	return {
		__esModules: true,
		...ActualRestClient,
		postResource: jest.fn(),
	};
});

const publicApiClient = defaultPublicApiClient;

const contextMock = {
	cloudId: faker.random.uuid(),
	orgId: faker.random.uuid(),
};
const testTeamId = faker.random.uuid();

const selectedUsers = [
	{
		accountId: faker.random.uuid(),
	},
	{
		accountId: faker.random.uuid(),
	},
];

const mockPostResource = jest
	.spyOn(RestClient.prototype, 'postResource')
	.mockReturnValue(Promise.resolve());

describe('publicApiClient', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		publicApiClient.setContext(contextMock);
	});

	describe('addUsersToTeam', () => {
		const selectedUsers = [
			{
				accountId: faker.random.uuid(),
			},
			{
				accountId: faker.random.uuid(),
			},
		];
		it('should throw error when members is empty', async () => {
			await expect(publicApiClient.addUsersToTeam(testTeamId, [])).rejects.toThrow(
				'Missing members to add',
			);
		});

		it('should call api successfully', async () => {
			await publicApiClient.addUsersToTeam(testTeamId, selectedUsers);

			expect(mockPostResource).toHaveBeenCalledWith(
				`/teams/v1/org/${contextMock.orgId}/teams/${testTeamId}/members/add`,
				{
					members: [
						{ accountId: selectedUsers[0].accountId },
						{ accountId: selectedUsers[1].accountId },
					],
				},
			);
		});

		it('should filter null accountIds', async () => {
			const selectedUsersWithNull = [
				{
					accountId: faker.random.uuid(),
				},
				{
					accountId: null,
				},
			];
			// @ts-ignore
			await publicApiClient.addUsersToTeam(testTeamId, selectedUsersWithNull);

			expect(mockPostResource).toHaveBeenCalledWith(
				`/teams/v1/org/${contextMock.orgId}/teams/${testTeamId}/members/add`,
				{
					members: [{ accountId: selectedUsersWithNull[0].accountId }],
				},
			);
		});

		it('throws an error when adding users to a team without an orgId', async () => {
			publicApiClient.setContext({
				cloudId: contextMock.cloudId,
				orgId: undefined,
			});
			const logSpy = jest.spyOn(publicApiClient, 'logException');
			await expect(
				publicApiClient.addUsersToTeam('team-id', [{ accountId: 'account-id' }]),
			).rejects.toThrow('No orgId set');
			expect(logSpy).toHaveBeenCalled();
		});

		it('should throw error when all members are missing accountIds', async () => {
			const selectedUsersWithNull = [
				{
					accountId: null,
				},
				{
					accountId: null,
				},
			];
			await expect(
				// @ts-ignore
				publicApiClient.addUsersToTeam(testTeamId, selectedUsersWithNull),
			).rejects.toThrow('Missing accountIds for all members');
		});
	});

	describe('removeTeamMemberships', () => {
		beforeAll(() => {
			publicApiClient.setContext(contextMock);
		});

		it('should throw error when members is empty', async () => {
			await expect(publicApiClient.removeTeamMemberships(testTeamId, [])).rejects.toThrow(
				'Missing members to remove',
			);
		});

		it('should call api successfully', async () => {
			await publicApiClient.removeTeamMemberships(testTeamId, selectedUsers);

			expect(mockPostResource).toHaveBeenCalledWith(
				`/teams/v1/org/${contextMock.orgId}/teams/${testTeamId}/members/remove`,
				{
					members: [
						{ accountId: selectedUsers[0].accountId },
						{ accountId: selectedUsers[1].accountId },
					],
				},
			);
		});

		it('throws an error when removing users from a team without an orgId', async () => {
			publicApiClient.setContext({
				cloudId: contextMock.cloudId,
				orgId: undefined,
			});
			const logSpy = jest.spyOn(publicApiClient, 'logException');
			await expect(
				publicApiClient.removeTeamMemberships('team-id', [{ accountId: 'account-id' }]),
			).rejects.toThrow('No orgId set');
			expect(logSpy).toHaveBeenCalled();
		});

		it('should filter null accountIds', async () => {
			const selectedUsersWithNull = [
				{
					accountId: faker.random.uuid(),
				},
				{
					accountId: null,
				},
			];
			await publicApiClient.removeTeamMemberships(
				testTeamId,
				// @ts-ignore
				selectedUsersWithNull,
			);

			expect(mockPostResource).toHaveBeenCalledWith(
				`/teams/v1/org/${contextMock.orgId}/teams/${testTeamId}/members/remove`,
				{
					members: [{ accountId: selectedUsersWithNull[0].accountId }],
				},
			);
		});

		it('should throw error when all members are missing accountIds', async () => {
			const selectedUsersWithNull = [
				{
					accountId: null,
				},
				{
					accountId: null,
				},
			];
			await expect(
				publicApiClient.removeTeamMemberships(
					testTeamId,
					// @ts-ignore
					selectedUsersWithNull,
				),
			).rejects.toThrow('Missing accountIds for all members');
		});
	});
});
