import fetchMock from 'fetch-mock';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { AGGQuery } from '../graphqlUtils';
import RovoAgentCardClient from '../RovoAgentCardClient';

jest.mock('../graphqlUtils', () => ({
	...jest.requireActual('../graphqlUtils'),
	AGGQuery: jest.fn(),
}));

const mockAGGQuery = AGGQuery as jest.Mock;

describe('RovoAgentCardClient', () => {
	const mockRestAgentResponse = {
		id: 'agent-id-123',
		name: 'Rovo Agent',
	};

	const mockActivationIdResponse = {
		tenantContexts: [
			{
				activationIdByProduct: {
					active: 'activation-id-123',
				},
			},
		],
	};

	const mockAggAgentResponseSuccess = {
		__typename: 'AgentStudioAssistant',
		authoringTeam: {
			displayName: 'Rovo Team',
			profileUrl: 'https://rovo.example.com/team/123',
		},
	};

	const mockOptions = {
		cloudId: 'cloud-id-123',
	};

	const mockAnalytics = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		fetchMock.reset();
	});

	ffTest.on('pt-deprecate-assistance-service', '', () => {
		describe('getProfile', () => {
			test('return correct result using agentId from both REST and AGG', async () => {
				fetchMock.get('/gateway/api/assist/rovo/v1/agents/agent-id-123', {
					body: mockRestAgentResponse,
				});

				mockAGGQuery.mockResolvedValueOnce(mockActivationIdResponse);
				mockAGGQuery.mockResolvedValueOnce({
					agentStudio_agentById: mockAggAgentResponseSuccess,
				});

				const mockAgentId = {
					type: 'agent' as const,
					value: 'agent-id-123',
				};
				const client = new RovoAgentCardClient(mockOptions);

				const result = await client.getProfile(mockAgentId, mockAnalytics);

				expect(result).toEqual({
					restData: mockRestAgentResponse,
					aggData: mockAggAgentResponseSuccess,
				});
			});

			test('return correct result using identityAccountId from both REST and AGG', async () => {
				fetchMock.get('/gateway/api/assist/rovo/v1/agents/accountid/identity-account-id-123', {
					body: mockRestAgentResponse,
				});

				mockAGGQuery.mockResolvedValueOnce(mockActivationIdResponse);
				mockAGGQuery.mockResolvedValueOnce({
					agentStudio_agentByIdentityAccountId: mockAggAgentResponseSuccess,
				});

				const mockIdentityAccountId = {
					type: 'identity' as const,
					value: 'identity-account-id-123',
				};
				const client = new RovoAgentCardClient(mockOptions);

				const result = await client.getProfile(mockIdentityAccountId, mockAnalytics);

				expect(result).toEqual({
					restData: mockRestAgentResponse,
					aggData: mockAggAgentResponseSuccess,
				});
			});

			test('fail to get activationId', async () => {
				fetchMock.get('/gateway/api/assist/rovo/v1/agents/agent-id-123', {
					body: mockRestAgentResponse,
				});
				mockAGGQuery.mockResolvedValueOnce(null);

				const mockAgentId = {
					type: 'agent' as const,
					value: 'agent-id-123',
				};
				const client = new RovoAgentCardClient(mockOptions);

				const result = await client.getProfile(mockAgentId, mockAnalytics);

				expect(result).toEqual({
					restData: mockRestAgentResponse,
					aggData: null,
				});

				expect(mockAnalytics).toHaveBeenCalledWith(
					'operational.rovoAgentProfilecard.failed.request',
					expect.objectContaining({
						errorMessage: 'ProfileCard Activation ID not found',
						errorType: 'RovoAgentProfileCardAggError',
					}),
				);
			});

			test('returning QueryError from AGG for agentStudio_agentById', async () => {
				fetchMock.get('/gateway/api/assist/rovo/v1/agents/agent-id-123', {
					body: mockRestAgentResponse,
				});
				mockAGGQuery.mockResolvedValueOnce(mockActivationIdResponse);
				mockAGGQuery.mockResolvedValueOnce({
					agentStudio_agentById: {
						__typename: 'QueryError',
						message: 'QueryError example message',
					},
				});

				const mockAgentId = {
					type: 'agent' as const,
					value: 'agent-id-123',
				};
				const client = new RovoAgentCardClient(mockOptions);

				const result = await client.getProfile(mockAgentId, mockAnalytics);

				expect(result).toEqual({
					restData: mockRestAgentResponse,
					aggData: null,
				});

				expect(mockAnalytics).toHaveBeenCalledWith(
					'operational.rovoAgentProfilecard.failed.request',
					expect.objectContaining({
						errorMessage:
							'ProfileCard agentStudio_agentById returning QueryError: QueryError example message',
						errorType: 'RovoAgentProfileCardAggError',
					}),
				);
			});

			test('returning QueryError from AGG for agentStudio_agentByIdentityAccountId', async () => {
				fetchMock.get('/gateway/api/assist/rovo/v1/agents/accountid/identity-account-id-123', {
					body: mockRestAgentResponse,
				});
				mockAGGQuery.mockResolvedValueOnce(mockActivationIdResponse);
				mockAGGQuery.mockResolvedValueOnce({
					agentStudio_agentByIdentityAccountId: {
						__typename: 'QueryError',
						message: 'QueryError example message',
					},
				});

				const mockIdentityAccountId = {
					type: 'identity' as const,
					value: 'identity-account-id-123',
				};
				const client = new RovoAgentCardClient(mockOptions);

				const result = await client.getProfile(mockIdentityAccountId, mockAnalytics);

				expect(result).toEqual({
					restData: mockRestAgentResponse,
					aggData: null,
				});

				expect(mockAnalytics).toHaveBeenCalledWith(
					'operational.rovoAgentProfilecard.failed.request',
					expect.objectContaining({
						errorMessage:
							'ProfileCard agentStudio_agentByIdentityAccountId returning QueryError: QueryError example message',
						errorType: 'RovoAgentProfileCardAggError',
					}),
				);
			});
		});
	});
});
