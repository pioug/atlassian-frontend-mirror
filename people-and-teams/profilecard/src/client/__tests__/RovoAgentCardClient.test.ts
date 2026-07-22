import fetchMock from 'fetch-mock';

import { AGGQuery } from '../graphqlUtils';
import RovoAgentCardClient from '../RovoAgentCardClient';
import { sharedAgentProfileCache } from '../sharedAgentProfileCache';

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
		sharedAgentProfileCache.clear();
		fetchMock.reset();
	});

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

	describe('setFavouriteAgent', () => {
		const cachedOptions = {
			cloudId: 'cloud-id-123',
			cacheSize: 10,
			cacheMaxAge: 60000,
		};
		const mockIdentityAccountId = {
			type: 'identity' as const,
			value: 'identity-account-id-123',
		};

		const primeCache = async (client: RovoAgentCardClient) => {
			fetchMock.getOnce('/gateway/api/assist/rovo/v1/agents/accountid/identity-account-id-123', {
				body: { id: 'agent-id-123', name: 'Rovo Agent', favourite: false, favourite_count: 2 },
			});
			mockAGGQuery.mockResolvedValueOnce(mockActivationIdResponse);
			mockAGGQuery.mockResolvedValueOnce({
				agentStudio_agentByIdentityAccountId: mockAggAgentResponseSuccess,
			});

			await client.getProfile(mockIdentityAccountId, mockAnalytics);
		};

		it('updates the cached profile favourite state', async () => {
			fetchMock.post('/gateway/api/assist/rovo/v1/agents/agent-id-123/favourite', 200);

			const client = new RovoAgentCardClient(cachedOptions);
			await primeCache(client);

			await client.setFavouriteAgent('agent-id-123', true, mockAnalytics);

			// Second read is served from cache (no further REST/AGG mocks set up) and
			// must reflect the new favourite state.
			const result = await client.getProfile(mockIdentityAccountId, mockAnalytics);

			expect(result.restData).toEqual(
				expect.objectContaining({ favourite: true, favourite_count: 3 }),
			);
		});

		it('shares favourite state across separate client instances (cross-surface)', async () => {
			fetchMock.post('/gateway/api/assist/rovo/v1/agents/agent-id-123/favourite', 200);

			// Instance A (e.g. the editor mention card) primes the shared cache and
			// toggles favourite.
			const clientA = new RovoAgentCardClient(cachedOptions);
			await primeCache(clientA);
			await clientA.setFavouriteAgent('agent-id-123', true, mockAnalytics);

			// Instance B (e.g. the side-nav card) is a *separate* client. With no REST
			// or AGG mocks set up for it, it must read the shared cache rather than
			// hitting the network — and see the favourite toggled by instance A.
			const clientB = new RovoAgentCardClient(cachedOptions);
			const result = await clientB.getProfile(mockIdentityAccountId, mockAnalytics);

			expect(result.restData).toEqual(
				expect.objectContaining({ favourite: true, favourite_count: 3 }),
			);
		});

		it('decrements the cached favourite_count when unfavouriting', async () => {
			fetchMock.delete('/gateway/api/assist/rovo/v1/agents/agent-id-123/favourite', 200);

			const client = new RovoAgentCardClient(cachedOptions);
			fetchMock.getOnce('/gateway/api/assist/rovo/v1/agents/accountid/identity-account-id-123', {
				body: { id: 'agent-id-123', name: 'Rovo Agent', favourite: true, favourite_count: 5 },
			});
			mockAGGQuery.mockResolvedValueOnce(mockActivationIdResponse);
			mockAGGQuery.mockResolvedValueOnce({
				agentStudio_agentByIdentityAccountId: mockAggAgentResponseSuccess,
			});
			await client.getProfile(mockIdentityAccountId, mockAnalytics);

			await client.setFavouriteAgent('agent-id-123', false, mockAnalytics);

			const result = await client.getProfile(mockIdentityAccountId, mockAnalytics);

			expect(result.restData).toEqual(
				expect.objectContaining({ favourite: false, favourite_count: 4 }),
			);
		});
	});
});
